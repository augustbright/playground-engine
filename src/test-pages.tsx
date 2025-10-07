import type React from "react";
import { Test1 } from "./pages/Test1";
import { Test2 } from "./pages/Test2";
import { Test3 } from "./pages/Test3";
import { Test4 } from "./pages/Test4";
import { Test5 } from "./pages/Test5";
import { Test6 } from "./pages/Test6";
import { Test7 } from "./pages/Test7";

export const TEST_PAGES: Array<{
    title: string;
    path: string;
    component: React.FC;
}> = [
    { title: "Test1", path: "test1", component: Test1 },
    { title: "Test2", path: "test2", component: Test2 },
    { title: "Test3", path: "test3", component: Test3 },
    { title: "Test4", path: "test4", component: Test4 },
    { title: "Test5", path: "test5", component: Test5 },
    {
        title: "Infinite Ground",
        path: "infinite-ground",
        component: Test6,
    },
    {
        title: "Toolbar",
        path: "toolbar",
        component: Test7,
    },
];
