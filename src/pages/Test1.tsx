import { useEffect, useRef } from "react";
import * as THREE from "three";

export const Test1 = () => {
    const screenRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!screenRef.current) return;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: screenRef.current!,
            antialias: true,
        });

        renderer.setSize(384, 384);

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;

        const animate = function () {
            requestAnimationFrame(animate);

            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            if (screenRef.current) {
                screenRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);
    return <canvas ref={screenRef} className="w-96 h-96"></canvas>;
};
