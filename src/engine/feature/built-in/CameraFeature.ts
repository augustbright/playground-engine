import * as THREE from "three";
import type { FeatureType } from "../../types";
import { AbstractFeature } from "../AbstractFeature";

export class CameraFeature extends AbstractFeature<
    {
        fov: number;
        aspect: number;
        near: number;
        far: number;
    },
    {
        camera: THREE.Camera;
    }
> {
    get type(): FeatureType {
        return "camera";
    }

    _init() {
        const { fov, aspect, near, far } = this.props;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        return { camera };
    }

    _act(): void {}

    _destroy(): void {}
}
