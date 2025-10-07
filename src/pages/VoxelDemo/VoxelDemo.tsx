import { TestPage } from "../../components/TestPage";
import { WorldRenderer } from "../../engine/components/WorldRenderer";
import { setupWorld0 } from "../../engine/entity/creators/setupWorld0";
import { useWorld } from "../../engine/hooks";
import { cell, loadVoxModel } from "../../engine/utils";

export const VoxelDemo = () => {
    const { camera, process, world } = useWorld(
        (world) => {
            const { camera } = setupWorld0(world);
            loadVoxModel("test", 0.1).then((group) => {
                world.add(group, {
                    position: cell(0, 0),
                });
            });

            loadVoxModel("castle", 0.1).then((group) => {
                world.add(group, {
                    position: cell(5, 0),
                });
            });

            return { camera };
        },
        {
            name: "Voxel Demo",
        }
    );
    return (
        <TestPage>
            <WorldRenderer
                world={world}
                camera={camera.object3D}
                active
                process={process}
            />
        </TestPage>
    );
};
