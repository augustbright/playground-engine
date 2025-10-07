import * as THREE from "three";
// import { CSS2DObject } from "three/examples/jsm/Addons.js";
import { Entity } from "../Entity";
import { Behavior } from "../../feature/built-in/Behavior";
import { inputManager } from "../../input";
import { map } from "rxjs";

export const addPlaneCursor = (
    world: Entity<THREE.Scene>,
    camera: THREE.Camera
) => {
    const raycaster = new THREE.Raycaster();

    const cast = () => {
        raycaster.setFromCamera(inputManager.pointerPosition, camera);

        const target = new THREE.Vector3();

        raycaster.ray.intersectPlane(
            new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
            target
        );
        return target;
    };

    const intersectionMarker = new Entity({
        object3D: new THREE.Object3D(),
        children: [
            // new Entity({
            //     object3D: label,
            //     position: new THREE.Vector3(0, 3, 0),
            //     features: [
            //         new Behavior({
            //             act() {
            //                 label.element.textContent = `x: ${intersectionMarker.object3D.position.x.toFixed(
            //                     2
            //                 )}, z: ${intersectionMarker.object3D.position.z.toFixed(
            //                     2
            //                 )}`;
            //             },
            //         }),
            //     ],
            // }),
            // new Entity({
            //     object3D: new Line2(
            //         new LineGeometry().setPositions([0, -100, 0, 0, 100, 0]),
            //         new LineMaterial({
            //             color: 0x333333,
            //             linewidth: 1,
            //         })
            //     ),
            // }),
            // new Entity({
            //     object3D: new Line2(
            //         new LineGeometry().setPositions([-100, 0, 0, 100, 0, 0]),
            //         new LineMaterial({
            //             color: 0x333333,
            //             linewidth: 1,
            //         })
            //     ),
            // }),
            // new Entity({
            //     object3D: new Line2(
            //         new LineGeometry().setPositions([0, 0, -100, 0, 0, 100]),
            //         new LineMaterial({
            //             color: 0x333333,
            //             linewidth: 1,
            //         })
            //     ),
            // }),
            // new Entity({
            //     object3D: new Line2(
            //         new LineGeometry().setPositions([0, 1, 0, 0, 1.5, 0]),
            //         new LineMaterial({
            //             color: 0xddffff,
            //             linewidth: 3,
            //         })
            //     ),
            // }),
            // new Entity({
            //     object3D: new Line2(
            //         new LineGeometry().setPositions([0, 0, 0, 0, -1, 0]),
            //         new LineMaterial({
            //             color: 0xddffff,
            //             linewidth: 3,
            //         })
            //     ),
            // }),
            // new Entity({
            //     object3D: new Line2(
            //         new LineGeometry().setPositions([0.75, 0, 0, 2.5, 0, 0]),
            //         new LineMaterial({
            //             color: 0xddffff,
            //             linewidth: 3,
            //         })
            //     ),
            // }),
            // new Entity({
            //     object3D: new Line2(
            //         new LineGeometry().setPositions([-0.75, 0, 0, -2.5, 0, 0]),
            //         new LineMaterial({
            //             color: 0xddffff,
            //             linewidth: 3,
            //         })
            //     ),
            // }),
            // new Entity({
            //     object3D: new Line2(
            //         new LineGeometry().setPositions([0, 0, 0.75, 0, 0, 2.5]),
            //         new LineMaterial({
            //             color: 0xddffff,
            //             linewidth: 3,
            //         })
            //     ),
            // }),
            // new Entity({
            //     object3D: new Line2(
            //         new LineGeometry().setPositions([0, 0, -0.75, 0, 0, -2.5]),
            //         new LineMaterial({
            //             color: 0xddffff,
            //             linewidth: 3,
            //         })
            //     ),
            // }),
        ],
        features: [
            new Behavior({
                act() {
                    intersectionMarker.object3D.position.copy(cast());
                },
                destroy() {},
            }),
        ],
    });

    const mouseClick$ = inputManager.mouseClick$.pipe(
        map((e) => {
            const target = cast();
            return {
                event: e.payload.event,
                cast: target,
                cell: {
                    x: Math.floor(target.x),
                    z: Math.floor(target.z),
                },
            };
        })
    );

    return {
        cursor: world.attachChild(intersectionMarker),
        mouseClick$,
    };
};
