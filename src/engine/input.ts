import { filter, Subject } from "rxjs";
import { clamp } from "three/src/math/MathUtils.js";

type AbstractInputEvent<T extends string, P> = {
    type: T;
    payload: P;
};

type InputEvent =
    | AbstractInputEvent<"attach", { element: HTMLElement }>
    | AbstractInputEvent<"detach", null>
    | AbstractInputEvent<"mouseenter", { event: MouseEvent }>
    | AbstractInputEvent<"mouseleave", { event: MouseEvent }>
    | AbstractInputEvent<"mousemove", { event: MouseEvent }>
    | AbstractInputEvent<"mousedown", { event: MouseEvent }>
    | AbstractInputEvent<"mouseup", { event: MouseEvent }>
    | AbstractInputEvent<"click", { event: MouseEvent }>
    | AbstractInputEvent<"keydown", { event: KeyboardEvent }>
    | AbstractInputEvent<"keyup", { event: KeyboardEvent }>;

type KeyCode = string;

export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
}

class InputManager {
    constructor() {
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
    }

    private element: HTMLElement | null = null;
    private subject = new Subject<InputEvent>();
    public events$ = this.subject.asObservable();
    public keyboardEvents$ = this.events$.pipe(
        filter((e) => e.type === "keydown" || e.type === "keyup")
    );
    public keyDown$ = this.events$.pipe(filter((e) => e.type === "keydown"));
    public keyUp$ = this.events$.pipe(filter((e) => e.type === "keyup"));

    public mouseEvents$ = this.events$.pipe(
        filter(
            (e) =>
                e.type === "mouseenter" ||
                e.type === "mouseleave" ||
                e.type === "mousemove" ||
                e.type === "click" ||
                e.type === "mousedown" ||
                e.type === "mouseup"
        )
    );

    public mouseClick$ = this.events$.pipe(filter((e) => e.type === "click"));

    private pressedKeys = new Set<KeyCode>();
    private pressedMouseButtons = new Set<MouseButton>();
    public mousePosition = { x: 0, y: 0 };
    public mouseInside = false;

    get pointerPosition() {
        if (!this.element) return new THREE.Vector2(0, 0);
        const pointer = new THREE.Vector2();
        pointer.x = (this.mousePosition.x / this.element.clientWidth) * 2 - 1;
        pointer.y = -(this.mousePosition.y / this.element.clientHeight) * 2 + 1;
        return pointer;
    }

    public isKeyPressed(code: KeyCode) {
        return this.pressedKeys.has(code);
    }

    public isMouseButtonPressed(button: MouseButton) {
        return this.pressedMouseButtons.has(button);
    }

    public getPressedKeys() {
        return Array.from(this.pressedKeys);
    }

    public getPressedMouseButtons() {
        return Array.from(this.pressedMouseButtons);
    }

    private updateMousePosition(event: MouseEvent) {
        this.mousePosition = {
            x: clamp(event.offsetX, 0, this.element?.clientWidth ?? 0),
            y: clamp(event.offsetY, 0, this.element?.clientHeight ?? 0),
        };
    }

    private onMouseEnter = (event: MouseEvent) => {
        this.mouseInside = true;
        this.updateMousePosition(event);

        this.subject.next({
            type: "mouseenter",
            payload: { event },
        });
    };

    private onMouseLeave = (event: MouseEvent) => {
        this.mouseInside = false;
        this.updateMousePosition(event);

        this.subject.next({
            type: "mouseleave",
            payload: { event },
        });
    };

    private onMouseMove = (event: MouseEvent) => {
        this.updateMousePosition(event);

        this.subject.next({
            type: "mousemove",
            payload: { event },
        });
    };

    private onMouseDown = (event: MouseEvent) => {
        this.pressedMouseButtons.add(event.button as MouseButton);
        this.subject.next({
            type: "mousedown",
            payload: { event },
        });
    };

    private onMouseUp = (event: MouseEvent) => {
        this.pressedMouseButtons.delete(event.button as MouseButton);
        this.subject.next({
            type: "mouseup",
            payload: { event },
        });
    };

    private onClick = (event: MouseEvent) => {
        this.subject.next({
            type: "click",
            payload: { event },
        });
    };

    private onKeyDown = (event: KeyboardEvent) => {
        if (!this.element) return;
        if (this.isKeyPressed(event.code)) return;
        this.pressedKeys.add(event.code as KeyCode);

        this.subject.next({
            type: "keydown",
            payload: { event },
        });
    };

    private onKeyUp = (event: KeyboardEvent) => {
        if (!this.element) return;

        this.pressedKeys.delete(event.code as KeyCode);

        this.subject.next({
            type: "keyup",
            payload: { event },
        });
    };

    attach(element: HTMLElement) {
        this.detach();
        this.element = element;

        element.addEventListener("mouseenter", this.onMouseEnter);
        element.addEventListener("mouseleave", this.onMouseLeave);
        element.addEventListener("mousemove", this.onMouseMove);
        element.addEventListener("click", this.onClick);
        element.addEventListener("mousedown", this.onMouseDown);
        element.addEventListener("mouseup", this.onMouseUp);

        this.subject.next({
            type: "attach",
            payload: { element },
        });
    }

    detach() {
        if (!this.element) return;

        this.element.removeEventListener("mouseenter", this.onMouseEnter);
        this.element.removeEventListener("mouseleave", this.onMouseLeave);
        this.element.removeEventListener("mousemove", this.onMouseMove);
        this.element.removeEventListener("click", this.onClick);

        this.element = null;
        this.subject.next({
            type: "detach",
            payload: null,
        });
    }
}

export const inputManager = new InputManager();
