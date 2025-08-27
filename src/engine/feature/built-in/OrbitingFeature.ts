import * as THREE from "three";
import { Feature } from "../Feature";

export class OrbitingFeature extends Feature<{
    speed: number;
    origin: THREE.Vector3;
    axis: THREE.Vector3;
}> {
    _init() {
        return {};
    }

    _act(delta: number): void {
        const object3D = this.entity!.object3D;
        object3D.position.sub(this.props.origin);
        object3D.position.applyAxisAngle(
            this.props.axis,
            this.props.speed * delta
        );
        object3D.position.add(this.props.origin);
    }

    _destroy(): void {}
}
