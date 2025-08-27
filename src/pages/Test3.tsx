import * as THREE from "three";
import { useEffect, useState } from "react";
import { TestPage } from "../components/TestPage";
import { WorldRenderer } from "../engine/components/WorldRenderer";
import { Entity } from "../engine/entity";
import { createWorld, process } from "../engine/utils";
import type { EntityProps } from "../engine/types";
import { SpinningFeature } from "../engine/feature/built-in/SpinningFeature";

type WorldInitializerFn<R> = (world: Entity<EntityProps, THREE.Scene>) => R;

const useWorld = <R,>(initializer: WorldInitializerFn<R>) => {
    const [[world, custom]] = useState(() => {
        const world = createWorld();
        const custom = initializer(world);

        return [world, custom] as const;
    });

    return { world, custom };
};

export const Test3 = () => {
    const [fps, setFps] = useState(0);
    const { world, custom } = useWorld((world) => {
        const camera = new Entity(
            world,
            {
                name: "Camera",
                position: new THREE.Vector3(0, 5, 5),
            },
            new THREE.PerspectiveCamera()
        );

        camera.object3D.lookAt(new THREE.Vector3(0, 0, 0));

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        const cube = new Entity(
            world,
            {
                name: "cube",
            },
            new THREE.Mesh(geometry, material)
        );

        new Entity(
            world,
            {
                name: "ambientLight",
            },
            new THREE.AmbientLight(0xffffff, 0.3)
        );

        const light = new Entity(
            world,
            {
                name: "light",
                position: new THREE.Vector3(3, 5, 3),
            },
            new THREE.PointLight(0xffffff, 10, 100)
        );

        light.object3D.lookAt(new THREE.Vector3(0, 0, 0));

        cube.createFeature(SpinningFeature, {
            speed: Math.PI / 360,
            axis: new THREE.Vector3(0, 1, 0),
        });

        const { stop, getFps } = process(world);

        return { camera: camera.object3D, stop, getFps };
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setFps(custom.getFps());
        }, 1000);

        return () => clearInterval(interval);
    }, [custom]);

    return (
        <TestPage>
            <div>FPS: {fps}</div>
            <WorldRenderer world={world} camera={custom.camera} active />
        </TestPage>
    );
};
