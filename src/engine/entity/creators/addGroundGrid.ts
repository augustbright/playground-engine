import * as THREE from "three";
import type { Entity } from "../Entity";
import { Behavior } from "../../feature/built-in/Behavior";
import fragmentShader from "./ground-grid.frag.glsl?raw";

export function addGroundGrid(
    world: Entity<THREE.Scene>,
    camera: THREE.Camera
) {
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uProjectionInv: { value: new THREE.Matrix4() },
            uViewInv: { value: new THREE.Matrix4() },
            uProjection: { value: new THREE.Matrix4() },
            uView: { value: new THREE.Matrix4() },

            cellSize: { value: 1.0 },
            majorEvery: { value: 10.0 },
            minorPx: { value: 1.0 },
            majorPx: { value: 2.0 },
            fadeStart: { value: 20.0 },
            fadeEnd: { value: 40.0 },

            baseColor: { value: new THREE.Color(0.0, 0.0, 0.0) },
            lineColor: { value: new THREE.Color(0.3, 0.3, 0.3) },
            axisColor: { value: new THREE.Color(0.0, 1.0, 0.0) },

            uLightPos: { value: new THREE.Vector3(0, 0, 0) },
            uLightColor: { value: new THREE.Color(0.6, 1, 1) },
            uLightRadius: { value: 10.0 },
            uLightIntensity: { value: 1.2 },

            uCellGlowColor: { value: new THREE.Color(0.2, 0.6, 1.0) },
            uCellGlowAlpha: { value: 1.0 },
            uCellGlowFeather: { value: 0.08 },
        },
        vertexShader: `
precision highp float;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0); // фуллскрин, без матриц
}
    `,
        fragmentShader,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });

    // полноэкранный квад
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    quad.frustumCulled = false;
    quad.renderOrder = 1_000_000;
    world.add(quad, {
        features: [
            new Behavior({
                act() {
                    material.uniforms.uProjectionInv.value.copy(
                        camera.projectionMatrixInverse
                    );
                    material.uniforms.uViewInv.value.copy(camera.matrixWorld);
                    material.uniforms.uProjection.value.copy(
                        camera.projectionMatrix
                    );
                    material.uniforms.uView.value.copy(
                        camera.matrixWorldInverse
                    );
                },
            }),
        ],
    });

    return quad;
}
