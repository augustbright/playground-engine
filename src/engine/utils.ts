import * as THREE from "three";
import { Entity } from "./entity";
import type { Tag } from "./types";
import EventEmitter from "eventemitter3";

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
