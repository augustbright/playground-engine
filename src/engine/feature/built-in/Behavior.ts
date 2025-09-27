import type { Entity } from "../../entity";
import { Feature } from "../Feature";

export class Behavior<S extends object = object> extends Feature<
    {
        init?: () => S;
        act?: (state: S, delta: number, entity: Entity) => S | void;
        destroy?: (state: S) => void;
    },
    S
> {
    _init() {
        return this.props.init?.() || ({} as S);
    }

    _act(): void {
        this.state = this.props.act?.(this.state, 0, this.entity!) || ({} as S);
    }

    _destroy(): void {
        this.props.destroy?.(this.state);
    }
}
