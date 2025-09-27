import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/Addons.js";
import { Entity } from "../Entity";
import { Behavior } from "../../feature/built-in/Behavior";
import { inputManager } from "../../input";

export const addPlaneCursor = (
    world: Entity<THREE.Scene>,
    camera: THREE.Camera
) => {
    const div = document.createElement("div");
    div.className = "text-white text-xs font-mono";
    div.textContent = "";

    const label = new CSS2DObject(div);

    const intersectionMarker = new Entity({
        object3D: new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 2, 0),
            ]),
            new THREE.LineBasicMaterial({
                color: 0xffffff,
                linewidth: 3,
            })
        ),
        children: [
            new Entity({
                object3D: label,
                position: new THREE.Vector3(0, 2, 0),
                features: [
                    new Behavior({
                        act() {
                            label.element.textContent = `x: ${intersectionMarker.object3D.position.x.toFixed(
                                2
                            )}, z: ${intersectionMarker.object3D.position.z.toFixed(
                                2
                            )}`;
                        },
                    }),
                ],
            }),
        ],
        features: [
            new Behavior({
                destroy() {
                    subscriptionMouse.unsubscribe();
                },
            }),
        ],
    });

    const raycaster = new THREE.Raycaster();

    const subscriptionMouse = inputManager.mouseEvents$.subscribe(() => {
        raycaster.setFromCamera(inputManager.pointerPosition, camera);

        const target = new THREE.Vector3();

        raycaster.ray.intersectPlane(
            new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
            target
        );

        intersectionMarker.object3D.position.copy(target);
    });

    return world.attachChild(intersectionMarker);
};
