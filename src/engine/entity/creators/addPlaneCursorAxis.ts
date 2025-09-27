import * as THREE from "three";
import type { Entity } from "../Entity";
import {
    Line2,
    LineGeometry,
    LineMaterial,
} from "three/examples/jsm/Addons.js";
import { Behavior } from "../../feature/built-in/Behavior";

const axisColor = 0x777777;

export const addPlaneCursorVisual = (cursor: Entity<THREE.Object3D>) => {
    cursor.add(
        new Line2(
            new LineGeometry(),
            new LineMaterial({
                color: axisColor,
                linewidth: 1,
            })
        ),
        {
            features: [
                new Behavior({
                    act(entity) {
                        (entity.object3D as Line2).geometry.setPositions([
                            0,
                            0,
                            0,
                            -cursor.object3D.position.x,
                            0,
                            0,
                        ]);
                    },
                }),
            ],
        }
    );

    cursor.add(
        new Line2(
            new LineGeometry(),
            new LineMaterial({
                color: axisColor,
                linewidth: 1,
            })
        ),
        {
            features: [
                new Behavior({
                    act(entity) {
                        (entity.object3D as Line2).geometry.setPositions([
                            0,
                            0,
                            0,
                            0,
                            0,
                            -cursor.object3D.position.z,
                        ]);
                    },
                }),
            ],
        }
    );

    // cursor.add(
    //     new Line2(
    //         new LineGeometry().setPositions([0, 0, 0, 0, 100, 0]),
    //         new LineMaterial({
    //             color: axisColor,
    //             linewidth: 1,
    //         })
    //     )
    // );
};
