import * as THREE from "three";
import cx from "classnames";
import { useEffect, useRef, useState, type HTMLAttributes } from "react";
import type { Entity } from "../entity";
import { inputManager } from "../input";
import { InputInfo } from "./InputInfo";
import type { ProcessControls } from "../utils";
import { useFPS } from "../hooks";
import { CSS2DRenderer } from "three/examples/jsm/Addons.js";

export const WorldRenderer = ({
    world,
    camera,
    active,
    process,
    ...rest
}: {
    world: Entity;
    process: ProcessControls;
    camera: THREE.Camera;
    active: boolean;
} & HTMLAttributes<HTMLCanvasElement>) => {
    const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
    const [cssRenderer, setCssRenderer] = useState<CSS2DRenderer | null>(null);
    const scene = world.object3D;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const cssRendererRef = useRef<HTMLDivElement>(null);

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
        const newCssRenderer = new CSS2DRenderer({
            element: cssRendererRef.current!,
        });
        setRenderer(newRenderer);
        setCssRenderer(newCssRenderer);

        return () => {
            newRenderer.dispose();
            setRenderer(null);
            setCssRenderer(null);
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
        if (!cssRenderer) return;
        const container = containerRef.current!;
        const resizeObserver = new ResizeObserver(() => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            cssRenderer.setSize(width, height);
        });

        resizeObserver.observe(container);

        return () => {
            resizeObserver.unobserve(container);
        };
    }, [cssRenderer]);

    useEffect(() => {
        if (!renderer || !scene || !camera) return;
        let animationFrameId: number;

        const render = () => {
            if (active) {
                animationFrameId = requestAnimationFrame(render);
                renderer.render(scene, camera);
                cssRenderer?.render(scene as THREE.Scene, camera);
            }
        };
        render();

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [world, renderer, scene, camera, active, cssRenderer]);

    const { fps } = useFPS(process);

    return (
        <div className="flex flex-col border-gray-700 flex-grow">
            <div className="p-1 text-xs text-gray-200 border-b border-slate-400 bg-slate-600 flex gap-2">
                <span>{world.object3D.name}</span>
                <span className="float-right">{fps} FPS</span>
            </div>
            <div className="flex-grow flex">
                <div className="flex flex-col border-r border-slate-400 bg-slate-600 w-48">
                    <InputInfo className=""></InputInfo>
                </div>
                <div
                    ref={containerRef}
                    className={cx("relative grow border", rest.className)}
                >
                    <canvas
                        className="absolute top-0 left-0 bg-red-400"
                        ref={canvasRef}
                        {...rest}
                    ></canvas>
                    <div
                        className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none text-white"
                        ref={cssRendererRef}
                    ></div>
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
            </div>
        </div>
    );
};
