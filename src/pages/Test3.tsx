import * as THREE from "three";
import { useEffect, useState } from "react";
import { TestPage } from "../components/TestPage";
import { WorldRenderer } from "../engine/components/WorldRenderer";
import { Entity } from "../engine/entity";
import { SpinningFeature } from "../engine/feature/built-in/SpinningFeature";
import { useWorld } from "../engine/hooks";

export const Test3 = () => {
    const [fps, setFps] = useState(0);
    const { world, custom, process } = useWorld((world) => {
        const camera = new Entity({
            name: "Camera",
            position: new THREE.Vector3(0, 5, 5),
            parent: world,
            object3D: new THREE.PerspectiveCamera(),
        });

        camera.object3D.lookAt(new THREE.Vector3(0, 0, 0));

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        new Entity({
            name: "cube",
            object3D: new THREE.Mesh(geometry, material),
            parent: world,
            features: [
                new SpinningFeature({
                    axis: new THREE.Vector3(0, 1, 0),
                    speed: Math.PI / 2,
                }),
            ],
        });

        new Entity({
            name: "ambientLight",
            object3D: new THREE.AmbientLight(0xffffff, 0.3),
            parent: world,
        });

        new Entity({
            name: "light",
            position: new THREE.Vector3(3, 5, 3),
            parent: world,
            object3D: new THREE.PointLight(0xffffff, 10, 100),
            setup(entity) {
                entity.object3D.lookAt(new THREE.Vector3(0, 0, 0));
            },
        });

        return { camera: camera.object3D };
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setFps(process.getFps());
        }, 1000);

        return () => clearInterval(interval);
    }, [process]);

    return (
        <TestPage>
            <div>FPS: {fps}</div>
            <WorldRenderer world={world} camera={custom.camera} active />
        </TestPage>
    );
};
