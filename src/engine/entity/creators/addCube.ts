import * as THREE from "three";
import type { Entity } from "../Entity";

export const addCube = (world: Entity<THREE.Scene>) => {
    return world.add(
        new THREE.Mesh(
            new THREE.BoxGeometry(),
            new THREE.MeshStandardMaterial({ color: 0x00ff00 })
        )
    );
};
