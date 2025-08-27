import * as THREE from "three";
import type { Constructor } from "type-fest";
import type { Feature } from "../feature/Feature";
import type { EntityId, Tag, Tags } from "../types";
import { makeId } from "../utils";

export type EntityProps<O extends THREE.Object3D = THREE.Object3D> = {
    name?: string;
    object3D: O;
    parent?: Entity;

    position?: THREE.Vector3;
    rotation?: THREE.Euler;
    scale?: THREE.Vector3;

    features?: Array<Feature>;
    children?: Array<Entity>;
    tags?: Tags;

    setup?: (entity: Entity<O>) => void;
};

export class Entity<O extends THREE.Object3D = THREE.Object3D> {
    public root: Entity;
    public readonly children: Map<EntityId, Entity> = new Map();
    public readonly features: Map<Constructor<Feature>, Set<Feature>> =
        new Map();
    public readonly id: EntityId = makeId() as EntityId;
    public readonly featureRegistry: Map<Constructor<Feature>, Set<Feature>> =
        new Map();
    public context: Record<string, unknown> = {};
    public tags: Tags = [];
    public readonly tagsRegistry: Map<Tag, Set<Entity>> = new Map();
    protected parent: Entity | undefined;
    public object3D: O;

    constructor(props: EntityProps<O>) {
        this.parent = props.parent;
        this.object3D = props.object3D;

        if (this.parent) {
            this.parent.attachChild(this);
        }
        this.root = this.parent ? this.parent.root : this;
        this.object3D.name =
            props.name ||
            `${Object.getPrototypeOf(this.object3D).constructor.name}-${
                this.id
            }`;
        if (props.position) {
            this.object3D.position.copy(props.position);
        }
        if (props.rotation) {
            this.object3D.rotation.copy(props.rotation);
        }
        if (props.scale) {
            this.object3D.scale.copy(props.scale);
        }

        props.setup?.(this);

        props.features?.forEach((feature) => this.attachFeature(feature));
        props.children?.forEach((child) => this.attachChild(child));
    }

    public registerFeature(feature: Feature): void {
        const registrySet = this.featureRegistry.get(
            Object.getPrototypeOf(feature).constructor
        );
        if (registrySet) {
            registrySet.add(feature);
        } else {
            this.featureRegistry.set(
                Object.getPrototypeOf(feature).constructor,
                new Set([feature])
            );
        }
        this.parent?.registerFeature(feature);
    }

    public unregisterFeature(feature: Feature): void {
        const registrySet = this.featureRegistry.get(
            Object.getPrototypeOf(feature).constructor
        );
        if (registrySet) {
            registrySet.delete(feature);
        }
        this.parent?.unregisterFeature(feature);
    }

    public act(delta: number): void {
        this.features.forEach((feature) =>
            feature.forEach((f) => f.act(delta))
        );
        this.children.forEach((child) => child.act(delta));
    }

    public destroy(): void {
        this.children.forEach((child) => {
            child.destroy();
            this.children.delete(child.id);
        });
        this.parent?.detachChild(this.id);
    }

    public registerTags(entity: Entity): void {
        entity.tags.forEach((tag) => {
            if (!this.tagsRegistry.has(tag)) {
                this.tagsRegistry.set(tag, new Set());
            }
            this.tagsRegistry.get(tag)!.add(entity);
        });
        this.parent?.registerTags(entity);
    }

    public unregisterTags(entity: Entity): void {
        entity.tags.forEach((tag) => {
            const registrySet = this.tagsRegistry.get(tag);
            if (registrySet) {
                registrySet.delete(entity);
                if (registrySet.size === 0) {
                    this.tagsRegistry.delete(tag);
                }
            }
        });
        this.parent?.unregisterTags(entity);
    }

    public add<OB extends THREE.Object3D>(
        object: OB,
        props: Omit<EntityProps<OB>, "parent" | "object3D"> = {}
    ) {
        const entity = new Entity({
            ...props,
            object3D: object,
            parent: this,
        });
        this.attachChild(entity);
        return entity;
    }

    public attachChild(child: Entity): void {
        this.children.set(child.id, child);
        child.parent = this;
        this.object3D.add(child.object3D);
        Object.setPrototypeOf(child.context, this.context);
        this.registerTags(child);
    }

    public detachChild(id: EntityId): Entity | undefined {
        const child = this.children.get(id);
        if (child) {
            this.children.delete(id);
            child.parent = undefined;
            child.object3D.removeFromParent();
            Object.setPrototypeOf(child.context, Object.prototype);
            this.unregisterTags(child);

            return child;
        }

        return undefined;
    }

    public attachFeature(feature: Feature): void {
        let featureSet = this.features.get(
            Object.getPrototypeOf(feature).constructor
        );
        if (!featureSet) {
            featureSet = new Set();
            this.features.set(
                Object.getPrototypeOf(feature).constructor,
                featureSet
            );
        }
        featureSet.add(feature);
        feature.entity = this;
        this.registerFeature(feature);
    }

    public detachFeature(feature: Feature): Feature | undefined {
        const featureSet = this.features.get(
            Object.getPrototypeOf(feature).constructor
        );
        if (featureSet) {
            featureSet.delete(feature);
            if (featureSet.size === 0) {
                this.features.delete(
                    Object.getPrototypeOf(feature).constructor
                );
            }
            this.unregisterFeature(feature);
        }
        return feature;
    }

    public getFeature<C extends Constructor<Feature>>(
        featureClass: C
    ): InstanceType<C> | undefined {
        return this.features.get(featureClass) as InstanceType<C> | undefined;
    }

    public getFromContext<T = unknown>(key: string): T | undefined {
        return this.context[key] as T | undefined;
    }
}
