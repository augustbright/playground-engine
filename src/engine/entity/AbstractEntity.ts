import * as THREE from "three";
import type { Constructor } from "type-fest";
import type { AbstractFeature } from "../feature/AbstractFeature";
import type { EntityId, EntityProps, EntityState, Tag, Tags } from "../types";
import { makeId } from "../utils";

export abstract class AbstractEntity<
    P extends EntityProps = EntityProps,
    S extends EntityState = EntityState,
    O extends THREE.Object3D = THREE.Object3D
> {
    public root: AbstractEntity;
    public readonly children: Map<EntityId, AbstractEntity> = new Map();
    public readonly features: Map<
        Constructor<AbstractFeature>,
        AbstractFeature
    > = new Map();
    public readonly id: EntityId = makeId() as EntityId;
    public readonly featureRegistry: Map<
        Constructor<AbstractFeature>,
        Set<AbstractFeature>
    > = new Map();
    public context: Record<string, unknown> = {};
    public state: S;
    public tags: Tags = [];
    public readonly tagsRegistry: Map<Tag, Set<AbstractEntity>> = new Map();

    constructor(
        public parent: AbstractEntity | null,
        public props: P,
        public object3D: O
    ) {
        if (this.parent) {
            this.parent.attachChild(this);
        }
        this.root = this.parent ? this.parent.root : this;
        this.state = this._init();
        this.object3D.name = props.name || `Entity-${this.id}`;
        if (this.props.position) {
            this.object3D.position.copy(this.props.position);
        }
        if (this.props.rotation) {
            this.object3D.rotation.copy(this.props.rotation);
        }
        if (this.props.scale) {
            this.object3D.scale.copy(this.props.scale);
        }
    }

    abstract _init(): S;
    abstract _act(delta: number): void;
    abstract _destroy(): void;

    public registerFeature(feature: AbstractFeature): void {
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

    public unregisterFeature(feature: AbstractFeature): void {
        const registrySet = this.featureRegistry.get(
            Object.getPrototypeOf(feature).constructor
        );
        if (registrySet) {
            registrySet.delete(feature);
        }
        this.parent?.unregisterFeature(feature);
    }

    public act(delta: number): void {
        this._act(delta);
        this.features.forEach((feature) => feature.act(delta));
        this.children.forEach((child) => child.act(delta));
    }

    public destroy(): void {
        this.children.forEach((child) => {
            child.destroy();
            this.children.delete(child.id);
        });
        this._destroy();
        this.parent?.detachChild(this.id);
    }

    public registerTags(entity: AbstractEntity): void {
        entity.tags.forEach((tag) => {
            if (!this.tagsRegistry.has(tag)) {
                this.tagsRegistry.set(tag, new Set());
            }
            this.tagsRegistry.get(tag)!.add(entity);
        });
        this.parent?.registerTags(entity);
    }

    public unregisterTags(entity: AbstractEntity): void {
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

    public attachChild(child: AbstractEntity): void {
        this.children.set(child.id, child);
        child.parent = this;
        this.object3D.add(child.object3D);
        Object.setPrototypeOf(child.context, this.context);
        this.registerTags(child);
    }

    public detachChild(id: EntityId): AbstractEntity | undefined {
        const child = this.children.get(id);
        if (child) {
            this.children.delete(id);
            child.parent = null;
            child.object3D.removeFromParent();
            Object.setPrototypeOf(child.context, Object.prototype);
            this.unregisterTags(child);

            return child;
        }

        return undefined;
    }

    public _attachFeature(feature: AbstractFeature): void {
        this.features.set(Object.getPrototypeOf(feature).constructor, feature);
        this.registerFeature(feature);
    }

    public detachFeature(
        featureType: Constructor<AbstractFeature>
    ): AbstractFeature | undefined {
        const feature = this.features.get(featureType);
        if (feature) {
            this.features.delete(featureType);
            this.unregisterFeature(feature);
        }
        return feature;
    }

    public createFeature<C extends Constructor<AbstractFeature>>(
        featureClass: C,
        props: ConstructorParameters<C>[1]
    ) {
        return new featureClass(this, props);
    }

    public getFeature<C extends Constructor<AbstractFeature>>(
        featureClass: C
    ): InstanceType<C> | undefined {
        return this.features.get(featureClass) as InstanceType<C> | undefined;
    }

    public getFromContext<T = unknown>(key: string): T | undefined {
        return this.context[key] as T | undefined;
    }
}
