import * as THREE from "three";
import type { Entity } from "./entity";
import { useEffect, useState } from "react";
import { createWorld, process, type ProcessControls } from "./utils";

type InitReturn = {
    camera: Entity<THREE.Camera>;
};

type WorldInitializerFn<R extends InitReturn> = (
    world: Entity<THREE.Scene>
) => R;
type UseWorldParams = {
    name?: string;
};

export const useWorld = <R extends InitReturn>(
    initializer: WorldInitializerFn<R>,
    params: UseWorldParams = {}
) => {
    const [[world, custom, processControls]] = useState(() => {
        const world = createWorld({
            name: params.name,
        });
        const custom = initializer(world);

        return [world, custom, process(world)] as const;
    });

    useEffect(
        () => () => {
            processControls.stop();
        },
        [processControls]
    );

    return { world, custom, process: processControls, camera: custom.camera };
};

export const useFPS = (process: ProcessControls) => {
    const [fps, setFps] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setFps(process.getFps());
        }, 1000);

        return () => clearInterval(interval);
    }, [process]);

    return { fps };
};
