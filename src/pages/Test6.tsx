import { TestPage } from "../components/TestPage";
import { WorldRenderer } from "../engine/components/WorldRenderer";
import { addBasicLight } from "../engine/entity/creators/addBasicLight";
import { addCellHighlighter } from "../engine/entity/creators/addCellHighlighter";

import { addGroundGrid } from "../engine/entity/creators/addGroundGrid";
import { addPlaneCursor } from "../engine/entity/creators/addPlaneCursor";
import { addPlaneCursorVisual } from "../engine/entity/creators/addPlaneCursorAxis";
import { addPlaneCursorGroundGridLight } from "../engine/entity/creators/addPlaneCursorLight";
import { addTopCamera } from "../engine/entity/creators/addTopCamera";
import { addVolumeDust } from "../engine/entity/creators/addVolumeDust";
import { useWorld } from "../engine/hooks";

export const Test6 = () => {
    const { world, camera, process } = useWorld(
        (world) => {
            const camera = addTopCamera(world);
            addVolumeDust(camera);
            addBasicLight(world);
            const { cursor } = addPlaneCursor(world, camera.object3D);
            addPlaneCursorVisual(cursor);
            addCellHighlighter(world, cursor);
            const grid = addGroundGrid(world, camera.object3D);
            addPlaneCursorGroundGridLight(cursor, grid);

            return { camera };
        },
        { name: "Infinite Ground" }
    );
    return (
        <TestPage>
            <WorldRenderer
                className="cursor-none"
                active
                world={world}
                camera={camera.object3D}
                process={process}
            />
        </TestPage>
    );
};
