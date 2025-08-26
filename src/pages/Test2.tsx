import * as THREE from "three";
import { useState } from "react";
import { World } from "../engine/entity/World";
import { WorldRenderer } from "../engine/components/WorldRenderer";
import { Entity } from "../engine/entity";
import { CameraFeature } from "../engine/feature/built-in/CameraFeature";

export const Test2 = () => {
    const [world] = useState(() => {
        const world = new World(null, {});
        const camera = new Entity(world, {});
        new CameraFeature(camera, {
            fov: 75,
            aspect: 1,
            near: 0.1,
            far: 1000,
        });

        (
            camera.features.get("camera") as CameraFeature
        ).state.camera.position.z = 5;

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        world.getScene()!.add(cube);

        return world;
    });

    return (
        <WorldRenderer active world={world} className="w-96 h-96 border-2" />
    );
};
