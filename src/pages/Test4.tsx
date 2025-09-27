import { TestPage } from "../components/TestPage";
import { WorldRenderer } from "../engine/components/WorldRenderer";
import { LookAtFeature } from "../engine/feature/built-in/LookAtFeature";
import { OrbitingFeature } from "../engine/feature/built-in/OrbitingFeature";
import { useWorld } from "../engine/hooks";

export const Test4 = () => {
    const {
        world,
        process,
        custom: { camera },
    } = useWorld((world) => {
        const camera = world.add(new THREE.PerspectiveCamera(), {
            position: new THREE.Vector3(0, 10, 10),
            setup(camera) {
                camera.object3D.lookAt(new THREE.Vector3(0, 0, 0));
            },
        });

        world.add(new THREE.AmbientLight(0xffffff, 0.3));
        world.add(new THREE.DirectionalLight(0xffffff, 0.5), {
            position: new THREE.Vector3(5, 10, 7.5),
            setup(light) {
                light.object3D.lookAt(new THREE.Vector3(0, 0, 0));
            },
        });
        const cube = world.add(
            new THREE.Mesh(
                new THREE.BoxGeometry(),
                new THREE.MeshStandardMaterial({ color: 0x00ff00 })
            )
        );

        world.add(new THREE.Object3D(), {
            position: new THREE.Vector3(3, 0, 0),
            features: [
                new OrbitingFeature({
                    axis: new THREE.Vector3(0, 1, 0),
                    speed: Math.PI / 2,
                    origin: cube.object3D.position,
                }),
                new LookAtFeature({
                    target: cube.object3D.position,
                }),
            ],

            setup(entity) {
                const axisHelper = new THREE.AxesHelper(1);
                entity.object3D.add(axisHelper);

                const spotLight = new T.SpotLight(
                    0xffffff,
                    1,
                    100,
                    Math.PI / 8
                );
                entity.object3D.add(spotLight);
            },

            children: [],
        });

        return { camera };
    });
    return (
        <TestPage>
            <WorldRenderer
                active
                process={process}
                world={world}
                camera={camera.object3D}
            />
        </TestPage>
    );
};
