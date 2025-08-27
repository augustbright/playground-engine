import type { AbstractEntity } from "../../entity";
import { AbstractFeature } from "../AbstractFeature";

export class BehaviorFeature<
    CS extends object = object
> extends AbstractFeature<
    {
        init: () => CS;
        act: (delta: number, entity: AbstractEntity) => void;
        destroy: () => void;
    },
    CS
> {
    _init() {
        return this.props.init();
    }

    _act(delta: number) {
        this.props.act(delta, this.entity);
    }

    _destroy() {
        this.props.destroy();
    }
}
