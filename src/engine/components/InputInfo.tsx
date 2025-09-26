import * as THREE from "three";
import { useEffect, useState } from "react";
import { inputManager, MouseButton } from "../input";
import cn from "classnames";

export const InputInfo = ({ className }: { className?: string }) => {
    const [pressedKeys, setPressedKeys] = useState<string[]>([]);
    const [pressedMouseButtons, setPressedMouseButtons] = useState<
        MouseButton[]
    >([]);
    const [mousePosition, setMousePosition] = useState<{
        x: number;
        y: number;
    }>({ x: 0, y: 0 });
    const [pointerPosition, setPointerPosition] = useState<THREE.Vector2>(
        new THREE.Vector2()
    );
    const [mouseInside, setMouseInside] = useState<boolean>(false);

    useEffect(() => {
        const subscriptionKeyboard = inputManager.keyboardEvents$.subscribe(
            () => {
                setPressedKeys(inputManager.getPressedKeys());
            }
        );
        const subscriptionMouse = inputManager.mouseEvents$.subscribe(() => {
            setMousePosition(inputManager.mousePosition);
            setMouseInside(inputManager.mouseInside);
            setPointerPosition(inputManager.pointerPosition);
            setPressedMouseButtons(inputManager.getPressedMouseButtons());
        });
        return () => {
            subscriptionKeyboard.unsubscribe();
            subscriptionMouse.unsubscribe();
        };
    }, []);
    return (
        <div className={cn("p-2 flex flex-col gap-1 font-mono", className)}>
            <div className={cn({ "text-red-300": !mouseInside })}>
                Mouse: {mousePosition.x}, {mousePosition.y}{" "}
                {mouseInside ? "(inside)" : "(outside)"}
            </div>
            <div>
                Pointer: {pointerPosition.x.toFixed(2)},{" "}
                {pointerPosition.y.toFixed(2)}
            </div>
            {pressedKeys.length > 0 ? (
                <div>Pressed Keys: {pressedKeys.join(", ")}</div>
            ) : null}
            {pressedMouseButtons.length > 0 ? (
                <div>
                    Pressed Mouse Buttons:{" "}
                    {pressedMouseButtons
                        .map((btn) => MouseButton[btn])
                        .join(", ")}
                </div>
            ) : null}
        </div>
    );
};
