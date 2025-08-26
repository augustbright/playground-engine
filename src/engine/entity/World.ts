import type { CameraFeature } from "../feature/built-in/CameraFeature";
import { AbstractEntity } from "./AbstractEntity";
import * as THREE from "three";

export class World extends AbstractEntity {
    private _activeCameraFeature: CameraFeature | undefined = undefined;
    _init(): void {
        const scene = new THREE.Scene();
        this.context.scene = scene;
    }

    _act(): void {}

    _destroy(): void {}

    getScene() {
        return this.getFromContext<THREE.Scene>("scene");
    }

    getActiveCamera() {
        if (this._activeCameraFeature && this._activeCameraFeature.isActive) {
            return this._activeCameraFeature.state.camera;
        }
        const cameras = this.featureRegistry.get("camera") as
            | Set<CameraFeature>
            | undefined;
        if (cameras) {
            for (const cameraFeature of cameras) {
                if (cameraFeature.isActive) {
                    this._activeCameraFeature = cameraFeature;
                    return cameraFeature.state.camera;
                }
            }
        }
    }
}
