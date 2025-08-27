import * as THREE from "three";
import { AbstractFeature } from "../AbstractFeature";

export class SpinningFeature extends AbstractFeature<{
    speed: number;
    axis: THREE.Vector3;
}> {
    _init() {
        return {};
    }

    _act(delta: number): void {
        this.entity.object3D.rotateOnAxis(
            this.props.axis,
            this.props.speed * delta
        );
    }

    _destroy(): void {}
}
