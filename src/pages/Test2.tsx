import * as THREE from "three";
import { useState } from "react";
import { WorldRenderer } from "../engine/components/WorldRenderer";
import { Entity } from "../engine/entity";
import { createWorld, tag } from "../engine/utils";

export const Test2 = () => {
    const [[world, camera]] = useState(() => {
        const world = createWorld();
        const camera = new Entity({
            name: "Camera",
            tags: [tag("camera")],
            position: new THREE.Vector3(0, 0, 5),
            object3D: new THREE.PerspectiveCamera(75, 1, 0.1, 1000),
            parent: world,
        });

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        new Entity({
            name: "cube",
            object3D: new THREE.Mesh(geometry, material),
            parent: world,
        });

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
