import * as THREE from "three";
import cx from "classnames";
import { useEffect, useRef, useState, type HTMLAttributes } from "react";
import type { Entity } from "../entity";
import { inputManager } from "../input";
import { InputInfo } from "./InputInfo";

export const WorldRenderer = ({
    world,
    camera,
    active,
    ...rest
}: {
    world: Entity;
    camera: THREE.Camera;
    active: boolean;
} & HTMLAttributes<HTMLCanvasElement>) => {
    const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
    const scene = world.object3D;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        inputManager.attach(canvasRef.current!);
        canvasRef.current!.addEventListener("contextmenu", (e) =>
            e.preventDefault()
        );
        return () => {
            inputManager.detach();
        };
    }, []);

    useEffect(() => {
        if (!canvasRef.current) return;
        const newRenderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current!,
            antialias: true,
        });
        setRenderer(newRenderer);

        return () => {
            newRenderer.dispose();
            setRenderer(null);
        };
    }, []);

    useEffect(() => {
        if (!renderer) return;
        const container = containerRef.current!;
        const resizeObserver = new ResizeObserver(() => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            if (canvasRef.current) {
                canvasRef.current.width = width;
                canvasRef.current.height = height;
            }
            renderer.setSize(width, height, false);
            if (camera instanceof THREE.PerspectiveCamera) {
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            }
        });

        resizeObserver.observe(container);

        return () => {
            resizeObserver.unobserve(container);
        };
    }, [renderer, camera]);

    useEffect(() => {
        if (!renderer || !scene || !camera) return;
        let animationFrameId: number;

        const render = () => {
            if (active) {
                animationFrameId = requestAnimationFrame(render);
                renderer.render(scene, camera);
            }
        };
        render();

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [world, renderer, scene, camera, active]);

    return (
        <div
            ref={containerRef}
            className={cx(
                "relative grow border border-gray-700",
                rest.className
            )}
        >
            <InputInfo className="absolute top-2 left-2 text-xs text-white z-10 pointer-events-none"></InputInfo>
            <canvas
                className="absolute top-0 left-0 bg-red-400"
                ref={canvasRef}
                {...rest}
            ></canvas>
            <div
                className={cx(
                    "absolute flex justify-center items-center inset-0",
                    {
                        hidden: !!camera,
                    }
                )}
            >
                No active camera found
            </div>
        </div>
    );
};
