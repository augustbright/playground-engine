import * as THREE from "three";
import type { EntityProps, EntityState } from "../types";
import { AbstractEntity } from "./AbstractEntity";

export class Entity<
    P extends EntityProps = EntityProps,
    O extends THREE.Object3D = THREE.Object3D
> extends AbstractEntity<P, EntityState, O> {
    _init() {
        return {};
    }
    _act(): void {}
    _destroy(): void {}
}
