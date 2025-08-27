import * as THREE from "three";
import { AbstractEntity, Entity } from "./entity";
import type { Tag } from "./types";

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
    return new Entity(
        null,
        {
            name,
        },
        new THREE.Scene()
    );
};

export const process = (entity: AbstractEntity) => {
    let currentTime = performance.now();
    let framesCount = 0;
    let fps = 0;
    const act = () => {
        const newTime = performance.now();
        const delta = newTime - currentTime;
        currentTime = newTime;

        entity.act(delta);

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
