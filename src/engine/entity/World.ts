import type { EntityProps } from "../types";
import { AbstractEntity } from "./AbstractEntity";
import * as THREE from "three";

export class World extends AbstractEntity {
    constructor(parent: AbstractEntity | null, props: EntityProps) {
        const scene = new THREE.Scene();
        super(parent, props, scene);
        this.context.scene = scene;
    }
    _init() {
        return {};
    }

    _act(): void {}

    _destroy(): void {}

    getScene() {
        return this.getFromContext<THREE.Scene>("scene");
    }
}
