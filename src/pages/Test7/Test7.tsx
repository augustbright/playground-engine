import { TestPage } from "../../components/TestPage";
import { Button } from "../../components/ui/Button";
import { InputInfo } from "../../engine/components/InputInfo";
import { WorldRenderer } from "../../engine/components/WorldRenderer";
import { addBasicLight } from "../../engine/entity/creators/addBasicLight";
import { addCellHighlighter } from "../../engine/entity/creators/addCellHighlighter";
import { addGroundGrid } from "../../engine/entity/creators/addGroundGrid";
import { addPlaneCursor } from "../../engine/entity/creators/addPlaneCursor";
import { addPlaneCursorVisual } from "../../engine/entity/creators/addPlaneCursorAxis";
import { addPlaneCursorGroundGridLight } from "../../engine/entity/creators/addPlaneCursorLight";
import { addTopCamera } from "../../engine/entity/creators/addTopCamera";
import { addVolumeDust } from "../../engine/entity/creators/addVolumeDust";
import { useWorld } from "../../engine/hooks";
import cn from "classnames";
import { useStore } from "zustand";
import { STORE_API, Tool } from "./store";

export const Test7 = () => {
    const { tool, setTool, addBox, removeBox, clearBoxes } =
        useStore(STORE_API);

    const toolButtons: Record<Tool, React.ReactNode> = {
        [Tool.None]: (
            <Button
                className={cn("w-full")}
                selected={tool === Tool.None}
                onClick={() => setTool(Tool.None)}
            >
                None
            </Button>
        ),
        [Tool.AddBox]: (
            <Button
                className={cn("w-full")}
                selected={tool === Tool.AddBox}
                onClick={() => setTool(Tool.AddBox)}
            >
                Add Box
            </Button>
        ),
        [Tool.Clear]: (
            <Button
                className={cn("w-full")}
                selected={tool === Tool.Clear}
                onClick={() => setTool(Tool.Clear)}
            >
                Clear
            </Button>
        ),
    };

    const { camera, process, world } = useWorld(
        (world) => {
            const camera = addTopCamera(world);
            addVolumeDust(camera);
            const grid = addGroundGrid(world, camera.object3D);
            addBasicLight(world);
            const { cursor, mouseClick$ } = addPlaneCursor(
                world,
                camera.object3D
            );
            addPlaneCursorVisual(cursor);
            addCellHighlighter(world, cursor);
            addPlaneCursorGroundGridLight(cursor, grid);

            const subscription = mouseClick$.subscribe((e) => {
                switch (STORE_API.getState().tool) {
                    case Tool.AddBox: {
                        const ref = world.add(
                            new THREE.Mesh(
                                new THREE.BoxGeometry(1, 1, 1),
                                new THREE.MeshStandardMaterial({
                                    color: 0xff0000,
                                })
                            ),
                            {
                                position: new THREE.Vector3(
                                    e.cell.x + 0.5,
                                    0.5,
                                    e.cell.z + 0.5
                                ),
                            }
                        );
                        addBox(e.cell.x, e.cell.z, ref);
                        break;
                    }
                    case Tool.Clear:
                        removeBox(e.cell.x, e.cell.z);
                        break;
                    default:
                        break;
                }
            });

            return {
                camera,
                cleanup: () => {
                    subscription.unsubscribe();
                },
            };
        },
        {
            name: "Toolbar",
        }
    );
    return (
        <TestPage>
            <WorldRenderer
                camera={camera.object3D}
                world={world}
                process={process}
                aside={
                    <div className="flex flex-col gap-2">
                        <InputInfo className=""></InputInfo>
                        <div className="flex flex-col justify-stretch gap-1 p-1">
                            {Object.entries(toolButtons).map(
                                ([tool, content]) => (
                                    <div key={tool}>{content}</div>
                                )
                            )}
                        </div>
                        <Button
                            className={cn("w-full")}
                            onClick={() => clearBoxes()}
                        >
                            Clear All Boxes
                        </Button>
                        ,
                    </div>
                }
                active
            />
        </TestPage>
    );
};
