import * as THREE from "three";
import { useState } from "react";
import { WorldRenderer } from "../engine/components/WorldRenderer";
import { Entity } from "../engine/entity";
import { tag } from "../engine/utils";

export const Test2 = () => {
    const [[world, camera]] = useState(() => {
        const world = new Entity(
            null,
            {
                name: "World",
            },
            new THREE.Scene()
        );
        const camera = new Entity(
            world,
            {
                name: "Camera",
                tags: [tag("camera")],
                position: new THREE.Vector3(0, 0, 5),
            },
            new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
        );

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        new Entity(
            world,
            {
                name: "cube",
            },
            new THREE.Mesh(geometry, material)
        );

        return [world, camera] as const;
    });

    return (
        <WorldRenderer
            active
            world={world}
            camera={camera.object3D}
            className="w-96 h-96 border-2"
        />
    );
};
