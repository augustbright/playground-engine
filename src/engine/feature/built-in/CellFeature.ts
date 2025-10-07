import type { Entity } from "../../entity";
import { Feature } from "../Feature";
import { CellXIndex } from "../indexes";

export class CellFeature extends Feature<{
    cell: { x: number; z: number };
}> {
    _init() {
        return {};
    }

    private onceBoundToEntity() {
        this.updateIndex(CellXIndex);
    }

    _act(): void {}

    _destroy(): void {}
}
