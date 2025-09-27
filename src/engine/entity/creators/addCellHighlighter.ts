import * as THREE from "three";
import { Entity } from "../Entity";
import { Behavior } from "../../feature/built-in/Behavior";
import {
    Line2,
    LineGeometry,
    LineMaterial,
} from "three/examples/jsm/Addons.js";

type HighlightState = {
    hovered: boolean;
    timeIn: number | null;
    timeOut: number | null;
    x: number;
    z: number;
    entity: Entity<THREE.Object3D>;
};

export const addCellHighlighter = (
    world: Entity<THREE.Scene>,
    cursor: Entity<THREE.Object3D>
) => {
    let currentlyHovered: HighlightState | null = null;
    const highlights: Map<number, Map<number, HighlightState>> = new Map();

    const manager = cursor.add(new THREE.Object3D(), {
        features: [
            new Behavior({
                act() {
                    const now = performance.now();
                    const hx = Math.floor(cursor.object3D.position.x);
                    const hz = Math.floor(cursor.object3D.position.z);

                    if (
                        !currentlyHovered ||
                        currentlyHovered.x !== hx ||
                        currentlyHovered.z !== hz
                    ) {
                        if (currentlyHovered) {
                            currentlyHovered.hovered = false;
                            currentlyHovered.timeOut = now;
                            currentlyHovered.timeIn = null;
                        }

                        if (!highlights.has(hx)) {
                            highlights.set(hx, new Map());
                        }

                        const columnHighlights = highlights.get(hx)!;
                        if (!columnHighlights.has(hz)) {
                            columnHighlights.set(hz, {
                                hovered: true,
                                timeIn: now,
                                timeOut: null,
                                x: hx,
                                z: hz,
                                entity: world.add(
                                    new THREE.Mesh(
                                        new THREE.PlaneGeometry(1, 1),
                                        new THREE.MeshBasicMaterial({
                                            color: 0x00ffff,
                                            opacity: 0.2,
                                            transparent: true,
                                        })
                                    ),
                                    {
                                        position: new THREE.Vector3(
                                            hx + 0.5,
                                            0,
                                            hz + 0.5
                                        ),
                                        rotation: new THREE.Euler(
                                            -Math.PI / 2,
                                            0,
                                            0
                                        ),
                                        children: [
                                            new Entity({
                                                object3D: new Line2(
                                                    new LineGeometry().setPositions(
                                                        [
                                                            -0.5, 0, -0.5, -0.5,
                                                            0, 0.5, 0.5, 0, 0.5,
                                                            0.5, 0, -0.5, -0.5,
                                                            0, -0.5,
                                                        ]
                                                    ),
                                                    new LineMaterial({
                                                        color: 0x00ffff,
                                                        linewidth: 2,
                                                    })
                                                ),
                                                rotation: new THREE.Euler(
                                                    -Math.PI / 2,
                                                    0,
                                                    0
                                                ),
                                            }),
                                        ],
                                        features: [
                                            new Behavior({
                                                act(entity, delta) {
                                                    const state = highlights
                                                        .get(hx)
                                                        ?.get(hz);

                                                    if (!state) {
                                                        entity.destroy();
                                                        return;
                                                    }

                                                    if (!state.hovered) {
                                                        const now =
                                                            performance.now();
                                                        const timePassed =
                                                            now -
                                                            (state.timeOut ??
                                                                0);
                                                        const fadeDuration = 100; // ms
                                                        const alpha = Math.max(
                                                            0,
                                                            0.2 -
                                                                (0.2 *
                                                                    timePassed) /
                                                                    fadeDuration
                                                        );

                                                        (
                                                            (
                                                                entity.object3D as THREE.Mesh
                                                            )
                                                                .material as THREE.MeshBasicMaterial
                                                        ).opacity = alpha;

                                                        if (alpha <= 0.01) {
                                                            columnHighlights.delete(
                                                                hz
                                                            );
                                                        }
                                                    }
                                                },
                                            }),
                                        ],
                                    }
                                ),
                            });
                        }

                        const existing = columnHighlights.get(hz)!;
                        existing.hovered = true;
                        existing.timeIn = existing.timeIn ?? now;
                        existing.timeOut = null;

                        currentlyHovered = columnHighlights.get(hz)!;
                    }
                },
            }),
        ],
    });

    return manager;
};
