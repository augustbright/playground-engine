import { TestPage } from "../components/TestPage";
import { WorldRenderer } from "../engine/components/WorldRenderer";
import { addBasicLight } from "../engine/entity/creators/addBasicLight";
import { addCellHighlighter } from "../engine/entity/creators/addCellHighlighter";

import { addGroundGrid } from "../engine/entity/creators/addGroundGrid";
import { addPlaneCursor } from "../engine/entity/creators/addPlaneCursor";
import { addPlaneCursorVisual } from "../engine/entity/creators/addPlaneCursorAxis";
import { addTopCamera } from "../engine/entity/creators/addTopCamera";
import { Behavior } from "../engine/feature/built-in/Behavior";
import { useWorld } from "../engine/hooks";

export const Test6 = () => {
    const { world, camera, process } = useWorld(
        (world) => {
            const camera = addTopCamera(world);
            addBasicLight(world);
            const marker = addPlaneCursor(world, camera.object3D);
            addPlaneCursorVisual(marker);
            addCellHighlighter(world, marker);
            const grid = addGroundGrid(world, camera.object3D);

            marker.attachFeature(
                new Behavior({
                    act() {
                        grid.material.uniforms.uLightPos.value.copy(
                            marker.object3D.position
                        );
                    },
                })
            );
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
