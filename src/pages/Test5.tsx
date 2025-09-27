import * as THREE from "three";
import { TestPage } from "../components/TestPage";
import { WorldRenderer } from "../engine/components/WorldRenderer";
import { useWorld } from "../engine/hooks";
import { addBasicLight } from "../engine/entity/creators/addBasicLight";
import { addPerspectiveCamera } from "../engine/entity/creators/addPerspectiveCamera";
import { addPlaneCursor } from "../engine/entity/creators/addPlaneCursor";

export const Test5 = () => {
    const {
        custom: { camera },
        world,
        process,
    } = useWorld(
        (world) => {
            const camera = addPerspectiveCamera(world);
            addPlaneCursor(world, camera.object3D);
            addBasicLight(world);

            world.add(
                new THREE.Mesh(
                    new THREE.PlaneGeometry(10, 10),
                    // render vertex only
                    new THREE.MeshBasicMaterial({
                        color: 0x999999,
                        wireframe: true,
                    })
                ),
                {
                    rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
                }
            );

            return { camera };
        },
        {
            name: "Test5 World",
        }
    );
    return (
        <TestPage>
            <WorldRenderer
                active
                world={world}
                process={process}
                camera={camera.object3D}
            />
        </TestPage>
    );
};
