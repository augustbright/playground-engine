import * as THREE from "three";
import type { Entity } from "../Entity";

export const addBasicLight = (world: Entity<THREE.Scene>) => {
    world.add(new THREE.DirectionalLight(0xffffff, 0.3));
    world.add(new THREE.AmbientLight(0xffffff, 0.1));
};
