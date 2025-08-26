import type { AbstractFeature } from "../feature/AbstractFeature";
import type { EntityId, EntityProps, FeatureType } from "../types";
import { makeId } from "../utils";

export abstract class AbstractEntity<P extends EntityProps = EntityProps> {
    public root: AbstractEntity;
    public readonly children: Map<EntityId, AbstractEntity> = new Map();
    public readonly features: Map<FeatureType, AbstractFeature> = new Map();
    public readonly id: EntityId = makeId() as EntityId;
    public readonly featureRegistry: Map<FeatureType, Set<AbstractFeature>> =
        new Map();

    constructor(public parent: AbstractEntity | null, public props: P) {
        if (this.parent) {
            this.parent.attachChild(this);
        }
        this.root = this.parent ? this.parent.root : this;
        this._init();
    }

    abstract _init(): void;
    abstract _act(delta: number): void;
    abstract _destroy(): void;

    public registerFeature(feature: AbstractFeature): void {
        const registrySet = this.featureRegistry.get(feature.constructor.name);
        if (registrySet) {
            registrySet.add(feature);
        } else {
            this.featureRegistry.set(
                feature.constructor.name,
                new Set([feature])
            );
        }
        this.parent?.registerFeature(feature);
    }

    public act(delta: number): void {
        this._act(delta);
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

    public attachChild(child: AbstractEntity): void {
        this.children.set(child.id, child);
        child.parent = this;
    }

    public detachChild(id: EntityId): AbstractEntity | undefined {
        const child = this.children.get(id);
        if (child) {
            this.children.delete(id);
            child.parent = null;

            return child;
        }

        return undefined;
    }

    public attachFeature(feature: AbstractFeature): void {
        this.features.set(feature.constructor.name, feature);
        this.registerFeature(feature);
    }

    public detachFeature(
        featureType: FeatureType
    ): AbstractFeature | undefined {
        const feature = this.features.get(featureType);
        if (feature) {
            this.features.delete(featureType);
        }
        return feature;
    }
}
