import * as THREE from "three";
import { TestPage } from "../components/TestPage";
import { WorldRenderer } from "../engine/components/WorldRenderer";
import { useWorld } from "../engine/hooks";
import { inputManager } from "../engine/input";

export const Test5 = () => {
    const {
        custom: { camera },
        world,
    } = useWorld((world) => {
        const camera = world.add(new THREE.PerspectiveCamera(), {
            position: new THREE.Vector3(0, 10, 10),
            rotation: new THREE.Euler(-Math.PI / 4, 0, 0),
        });

        const intersectionMarker = world.add(
            new THREE.Mesh(
                new THREE.BoxGeometry(),
                new THREE.MeshStandardMaterial({ color: 0x0000ff })
            )
        );

        const raycaster = new THREE.Raycaster();

        const subscriptionMouse = inputManager.mouseEvents$.subscribe(() => {
            raycaster.setFromCamera(
                inputManager.pointerPosition,
                camera.object3D
            );

            const target = new THREE.Vector3();

            raycaster.ray.intersectPlane(
                new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
                target
            );

            intersectionMarker.object3D.position.copy(target);
        });

        world.add(new THREE.DirectionalLight(0xffffff, 0.3));
        world.add(new THREE.AmbientLight(0xffffff, 0.1));

        world.add(
            new THREE.Mesh(
                new THREE.PlaneGeometry(10, 10),
                new THREE.MeshStandardMaterial({ color: 0x00ff00 })
            ),
            {
                rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
            }
        );

        return { camera };
    });
    return (
        <TestPage>
            <WorldRenderer active world={world} camera={camera.object3D} />
        </TestPage>
    );
};
