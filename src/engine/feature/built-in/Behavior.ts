import type { Entity } from "../../entity";
import { Feature } from "../Feature";

export class Behavior<S extends object = object> extends Feature<
    {
        init?: () => S;
        act?: (entity: Entity, delta: number, state: S) => S | void;
        destroy?: (state: S) => void;
    },
    S
> {
    _init() {
        return this.props.init?.() || ({} as S);
    }

    _act(delta: number): void {
        this.state =
            this.props.act?.(this.entity!, delta, this.state) || ({} as S);
    }

    _destroy(): void {
        this.props.destroy?.(this.state);
    }
}
