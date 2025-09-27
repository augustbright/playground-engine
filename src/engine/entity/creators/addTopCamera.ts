import * as THREE from "three";
import { Entity } from "../Entity";
import { Behavior } from "../../feature/built-in/Behavior";
import { inputManager } from "../../input";

export const addTopCamera = (world: Entity<THREE.Scene>) => {
    return world.add(new THREE.PerspectiveCamera(90), {
        position: new THREE.Vector3(0, 5, 5),
        rotation: new THREE.Euler(-Math.PI / 4, 0, 0),
        features: [
            new Behavior({
                act(entity, delta) {
                    if (inputManager.isKeyPressed("KeyW")) {
                        entity.object3D.position.z -= 10 * delta;
                    }
                    if (inputManager.isKeyPressed("KeyS")) {
                        entity.object3D.position.z += 10 * delta;
                    }
                    if (inputManager.isKeyPressed("KeyA")) {
                        entity.object3D.position.x -= 10 * delta;
                    }
                    if (inputManager.isKeyPressed("KeyD")) {
                        entity.object3D.position.x += 10 * delta;
                    }
                },
            }),
        ],
    });
};
