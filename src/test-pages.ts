import { Test1 } from "./pages/Test1";
import { Test2 } from "./pages/Test2";

export const TEST_PAGES: Array<{
    title: string;
    path: string;
    component: React.FC;
}> = [
    { title: "Test1", path: "test1", component: Test1 },
    { title: "Test2", path: "test2", component: Test2 },
];
