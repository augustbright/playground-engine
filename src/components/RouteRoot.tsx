import { Link, Outlet } from "react-router";
import { TEST_PAGES } from "../test-pages";
import cx from "classnames";
import { useState } from "react";
import { Button } from "./ui/Button";
import { NumberedListIcon } from "@heroicons/react/24/outline";

export const RouteRoot = () => {
    const [showSidebar, setShowSidebar] = useState(true);

    return (
        <div className="flex flex-col">
            <nav className="bg-blue-500 text-white p-4 gap-4 flex items-center">
                <Button onClick={() => setShowSidebar((prev) => !prev)}>
                    <NumberedListIcon className="size-4" />
                </Button>
                <Link to="/" className="mr-4">
                    Playground Engine
                </Link>
            </nav>
            <div className="flex">
                {showSidebar && (
                    <nav className="w-48 bg-gray-100 p-4 border-r border-gray-300 min-h-screen">
                        {TEST_PAGES.map(({ title, path }) => (
                            <div key={path} className="p-2">
                                <Link
                                    to={path}
                                    className={cx("hover:underline")}
                                >
                                    {title}
                                </Link>
                            </div>
                        ))}
                    </nav>
                )}
                <Outlet />
            </div>
        </div>
    );
};
