import * as THREE from "three";
import { Behavior } from "../../feature/built-in/Behavior";
import type { Entity } from "../Entity";

export const addPlaneCursorGroundGridLight = (
    cursor: Entity,
    grid: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
) => {
    cursor.attachFeature(
        new Behavior({
            act() {
                grid.material.uniforms.uLightPos.value.copy(
                    cursor.object3D.position
                );
            },
        })
    );
    cursor.add(new THREE.PointLight(0xffffff, 0.3, 10), {
        position: new THREE.Vector3(0, 0, 0),
    });
};
