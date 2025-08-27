import type { AbstractEntity } from "../entity/AbstractEntity";
import type { FeatureId, FeatureProps, FeatureState } from "../types";
import { makeId } from "../utils";

export abstract class AbstractFeature<
    P extends FeatureProps = FeatureProps,
    S extends FeatureState = FeatureState
> {
    public readonly id: FeatureId = makeId() as FeatureId;
    public isActive: boolean = true;
    public state: S;

    constructor(public readonly entity: AbstractEntity, public props: P) {
        this.entity._attachFeature(this);
        this.state = this._init();
    }

    abstract _init(): S;
    abstract _act(delta: number): void;
    abstract _destroy(): void;

    public act(delta: number): void {
        this._act(delta);
    }

    public destroy(): void {
        this._destroy();
        this.entity.detachFeature(Object.getPrototypeOf(this).constructor);
    }
}
