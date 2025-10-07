import type { Entity } from "../entity";
import type { FeatureId, FeatureProps, FeatureState } from "../types";
import { makeId } from "../utils";

export abstract class Feature<
    P extends FeatureProps = FeatureProps,
    S extends FeatureState = FeatureState
> {
    public readonly id: FeatureId = makeId() as FeatureId;
    public isActive: boolean = true;
    public state: S;
    public entity: Entity | null = null;
    public isBoundEntity: boolean = false;

    constructor(public props: P) {
        this.state = this._init();
    }

    abstract _init(): S;
    abstract _act(delta: number): void;
    abstract _destroy(): void;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private onceBoundToEntity(entity: Entity) {
        // Override if needed
    }

    public act(delta: number): void {
        if (!this.isActive) return;
        if (!this.entity) return;
        if (!this.isBoundEntity) {
            this.onceBoundToEntity(this.entity);
        }
        this.isBoundEntity = true;

        this._act(delta);
    }

    public destroy(): void {
        this._destroy();
        this.isActive = false;
        this.entity?.detachFeature(Object.getPrototypeOf(this).constructor);
    }
}
