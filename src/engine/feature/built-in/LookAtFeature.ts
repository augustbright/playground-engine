import * as THREE from "three";
import { Feature } from "../Feature";

export class LookAtFeature extends Feature<{
    target: THREE.Vector3;
}> {
    _init() {
        return {};
    }

    _act(): void {
        const object3D = this.entity!.object3D;
        object3D.lookAt(this.props.target);
    }

    _destroy(): void {}
}
