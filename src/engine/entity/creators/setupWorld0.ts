import * as THREE from "three";
import type { Entity } from "../Entity";
import { addTopCamera } from "./addTopCamera";
import { addVolumeDust } from "./addVolumeDust";
import { addGroundGrid } from "./addGroundGrid";
import { addBasicLight } from "./addBasicLight";
import { addPlaneCursor } from "./addPlaneCursor";
import { addPlaneCursorVisual } from "./addPlaneCursorAxis";
import { addCellHighlighter } from "./addCellHighlighter";
import { addPlaneCursorGroundGridLight } from "./addPlaneCursorLight";

export const setupWorld0 = (world: Entity<THREE.Scene>) => {
    const camera = addTopCamera(world);
    const volumeDust = addVolumeDust(camera);
    const groundGrid = addGroundGrid(world, camera.object3D);
    const basicLight = addBasicLight(world);
    const cursor = addPlaneCursor(world, camera.object3D);
    const planeCursorVisual = addPlaneCursorVisual(cursor.cursor);
    const cellHighlighter = addCellHighlighter(world, cursor.cursor);
    const planeCursorGroundGridLight = addPlaneCursorGroundGridLight(
        cursor.cursor,
        groundGrid
    );

    return {
        camera,
        volumeDust,
        groundGrid,
        basicLight,
        cursor,
        planeCursorVisual,
        cellHighlighter,
        planeCursorGroundGridLight,
    };
};
