import { createStore } from "zustand";
import type { Entity } from "../../engine/entity";

export enum Tool {
    None,
    AddBox,
    Clear,
}

type Store = {
    tool: Tool;
    boxes: Array<{
        ref: Entity;
        x: number;
        z: number;
    }>;

    setTool: (tool: Tool) => void;
    addBox: (x: number, z: number, ref: Entity) => void;
    clearBoxes: () => void;
    removeBox: (x: number, z: number) => void;
};

export const STORE_API = createStore<Store>((set) => ({
    tool: Tool.None,
    boxes: [],

    setTool: (tool: Tool) => set({ tool }),
    addBox: (x: number, z: number, ref: Entity) =>
        set((state) => ({
            boxes: [...state.boxes, { x, z, ref }],
        })),
    clearBoxes: () => {
        set((state) => {
            state.boxes.forEach((b) => b.ref.destroy());
            return { boxes: [] };
        });
    },
    removeBox: (x: number, z: number) =>
        set((state) => {
            const box = state.boxes.find((b) => b.x === x && b.z === z);
            if (box) {
                box.ref.destroy();
            }
            return {
                boxes: state.boxes.filter((b) => b.x !== x || b.z !== z),
            };
        }),
}));
