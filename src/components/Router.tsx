import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { RouteRoot } from "./RouteRoot";
import { HomePage } from "../pages/HomePage";
import { TEST_PAGES } from "../test-pages";

const router = createBrowserRouter([
    {
        path: "/",
        Component: RouteRoot,
        children: [
            { index: true, Component: HomePage },
            ...TEST_PAGES.map(({ path, component }) => ({
                path,
                Component: component,
            })),
        ],
    },
]);

export const Router = () => {
    return <RouterProvider router={router} />;
};
