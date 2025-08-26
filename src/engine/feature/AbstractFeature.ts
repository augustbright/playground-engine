import type { AbstractEntity } from "../entity/AbstractEntity";
import type { FeatureId, FeatureProps, FeatureType } from "../types";
import { makeId } from "../utils";

export abstract class AbstractFeature<P extends FeatureProps = FeatureProps> {
    public readonly id: FeatureId = makeId() as FeatureId;

    constructor(public readonly entity: AbstractEntity, public props: P) {
        this.entity.attachFeature(this);
        this._init();
    }

    abstract get type(): FeatureType;
    abstract _init(): void;
    abstract _act(delta: number): void;
    abstract _destroy(): void;

    public act(delta: number): void {
        this._act(delta);
    }

    public destroy(): void {
        this._destroy();
        this.entity.detachFeature(this.type);
    }
}
