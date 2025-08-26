import type { EntityProps } from "../types";
import { AbstractEntity } from "./AbstractEntity";

export class Entity<P extends EntityProps> extends AbstractEntity<P> {
    _init(): void {}
    _act(): void {}
    _destroy(): void {}
}
