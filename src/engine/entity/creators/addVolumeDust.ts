import * as THREE from "three";
import type { Entity } from "../Entity";
import fragmentShader from "./dust.frag.glsl?raw";
import vertexShader from "./dust.vert.glsl?raw";
import { Behavior } from "../../feature/built-in/Behavior";

const clock = new THREE.Clock();

export const addVolumeDust = (camera: Entity<THREE.Camera>) => {
    const mat = new THREE.RawShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending, // or premultiplied alpha
        side: THREE.BackSide,
        uniforms: {
            uModel: { value: new THREE.Matrix4() },
            uModelInv: { value: new THREE.Matrix4() },
            uView: { value: new THREE.Matrix4() },
            uViewInv: { value: new THREE.Matrix4() },
            uProj: { value: new THREE.Matrix4() },

            uBoxMin: { value: new THREE.Vector3(-10, -5, -10) },
            uBoxMax: { value: new THREE.Vector3(+10, +5, +10) },

            uTime: { value: 0 },
            uLightDir: { value: new THREE.Vector3(0.3, -0.6, 0.2).normalize() },
            uLightColor: { value: new THREE.Color(1, 1, 1) },
            uDustAlbedo: { value: new THREE.Color(0.4, 0.9, 0.9) },
            uDensity: { value: 1.2 },
            uNoiseAmp: { value: 0.35 },
            uNoiseScale: { value: 2.4 },
            uWind: { value: new THREE.Vector3(0.3, 0.05, 0.0) },
            uSteps: { value: 32 },
            uJitter: { value: 0.7 },
            uAniso: { value: 0.6 },
            uExtinction: { value: 1.6 },
        },
    });
    const box = new THREE.Mesh(new THREE.BoxGeometry(20, 10, 20), mat);
    box.frustumCulled = false;
    return camera.add(box, {
        name: "Volume Dust",
        features: [
            new Behavior({
                act(entity, delta) {
                    mat.uniforms.uModel.value.copy(box.matrixWorld);
                    mat.uniforms.uModelInv.value.copy(box.matrixWorld).invert();
                    mat.uniforms.uView.value.copy(
                        camera.object3D.matrixWorldInverse
                    );
                    mat.uniforms.uViewInv.value.copy(
                        camera.object3D.matrixWorld
                    );
                    mat.uniforms.uProj.value.copy(
                        camera.object3D.projectionMatrix
                    );
                    mat.uniforms.uTime.value = clock.getElapsedTime();
                    entity.object3D.updateMatrixWorld();
                },
            }),
        ],
    });
};
