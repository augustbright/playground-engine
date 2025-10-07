import * as THREE from "three";
import { Entity } from "./entity";
import type { Tag } from "./types";
import { VOXLoader, VOXMesh } from "three/examples/jsm/Addons.js";

const currentId = { value: 0 };

export const makeId = () => {
    currentId.value += 1;
    return currentId.value;
};

export const tag = (t: string) => t as Tag;

export const createWorld = ({
    name = "World",
}: {
    name?: string;
} = {}) => {
    return new Entity({
        name,
        object3D: new THREE.Scene(),
        parent: undefined,
    });
};

export const process = (entity: Entity) => {
    let currentTime = performance.now();
    let framesCount = 0;
    let fps = 0;
    const act = () => {
        const newTime = performance.now();
        const delta = newTime - currentTime;
        const deltaInSeconds = delta / 1000;
        currentTime = newTime;

        entity.act(deltaInSeconds);

        framesCount++;
        requestAnimationFrame(act);
    };

    const fpsInterval = setInterval(() => {
        fps = framesCount;
        framesCount = 0;
    }, 1000);

    const request = requestAnimationFrame(act);
    return {
        stop: () => {
            cancelAnimationFrame(request);
            clearInterval(fpsInterval);
        },
        getFps: () => fps,
    };
};

export type ProcessControls = ReturnType<typeof process>;

export const loadVoxModel = (name: string, scale: number = 1) => {
    const loader = new VOXLoader();

    return new Promise<THREE.Group>((resolve, reject) => {
        const group = new THREE.Group();
        loader.load(
            `assets/models/vox/${name}.vox`,
            function (chunks) {
                try {
                    for (let i = 0; i < chunks.length; i++) {
                        const chunk = chunks[i];

                        const mesh = new VOXMesh(chunk);
                        group.add(mesh);
                        mesh.scale.setScalar(scale);
                    }
                    resolve(group);
                } catch (err) {
                    reject(err);
                }
            },
            undefined,
            (err) => reject(err)
        );
    });
};

export const cell = (x: number, z: number) =>
    new THREE.Vector3(x + 0.5, 0.5, z + 0.5);
