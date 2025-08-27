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

    constructor(public props: P) {
        this.state = this._init();
    }

    abstract _init(): S;
    abstract _act(delta: number): void;
    abstract _destroy(): void;

    public act(delta: number): void {
        if (!this.isActive) return;
        if (!this.entity) return;

        this._act(delta);
    }

    public destroy(): void {
        this._destroy();
        this.isActive = false;
        this.entity?.detachFeature(Object.getPrototypeOf(this).constructor);
    }
}
