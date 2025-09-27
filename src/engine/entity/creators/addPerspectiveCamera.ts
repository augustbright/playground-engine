import * as THREE from "three";
import { Entity } from "../Entity";

export const addPerspectiveCamera = (world: Entity<THREE.Scene>) => {
    return world.add(new THREE.PerspectiveCamera(), {
        position: new THREE.Vector3(0, 10, 10),
        rotation: new THREE.Euler(-Math.PI / 4, 0, 0),
    });
};
