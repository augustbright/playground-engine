import * as THREE from "three";
import cx from "classnames";
import { useEffect, useRef, useState, type HTMLAttributes } from "react";
import type { World } from "../entity/World";

export const WorldRenderer = ({
    world,
    active,
    ...rest
}: { world: World; active: boolean } & HTMLAttributes<HTMLCanvasElement>) => {
    const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
    const scene = world.getScene();
    const camera = world.getActiveCamera();
    const canvasRef = useRef<HTMLCanvasElement>(null);

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
        // observe resize of the canvas
        const canvas = renderer.domElement;
        const resizeObserver = new ResizeObserver(() => {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            if (canvas.width !== width || canvas.height !== height) {
                renderer.setSize(width, height, false);
                if (camera instanceof THREE.PerspectiveCamera) {
                    camera.aspect = width / height;
                    camera.updateProjectionMatrix();
                }
            }
        });

        resizeObserver.observe(canvas);

        return () => {
            resizeObserver.unobserve(canvas);
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
        <div className={cx("relative", rest.className)}>
            <canvas ref={canvasRef} {...rest}></canvas>
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
