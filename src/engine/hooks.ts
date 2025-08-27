import * as THREE from "three";
import type { Entity } from "./entity";
import { useEffect, useState } from "react";
import { createWorld, process } from "./utils";

type WorldInitializerFn<R> = (world: Entity<THREE.Scene>) => R;

export const useWorld = <R>(initializer: WorldInitializerFn<R>) => {
    const [[world, custom, processControls]] = useState(() => {
        const world = createWorld();
        const custom = initializer(world);

        return [world, custom, process(world)] as const;
    });

    useEffect(
        () => () => {
            processControls.stop();
        },
        [processControls]
    );

    return { world, custom, process: processControls };
};
