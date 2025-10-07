import { Link, Outlet } from "react-router";
import { TEST_PAGES } from "../test-pages";
import cx from "classnames";
import { useState } from "react";
import { Button } from "./ui/Button";
import { NumberedListIcon } from "@heroicons/react/24/outline";

export const RouteRoot = () => {
    const [showSidebar, setShowSidebar] = useState(true);

    return (
        <div className="flex flex-col h-screen">
            <nav className="bg-slate-900 text-gray-200 border-b border-slate-400 p-4 gap-4 flex items-center shrink-0 font-mono">
                <Button
                    color="blue"
                    onClick={() => setShowSidebar((prev) => !prev)}
                >
                    <NumberedListIcon className="size-4" />
                </Button>
                <Link to="/" className="mr-4">
                    Worlds
                </Link>
            </nav>
            <div className="flex grow">
                {showSidebar && (
                    <nav className="w-48 bg-slate-900 text-gray-200 p-4 border-r border-slate-400 shrink-0 overflow-y-auto">
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
                <div className="flex flex-col grow shrink">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};
