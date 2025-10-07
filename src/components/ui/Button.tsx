import cx from "classnames";

/*
bg-blue-600 bg-red-600 bg-green-600 bg-gray-600
bg-blue-400 bg-red-400 bg-green-400 bg-gray-400
hover:bg-blue-400 hover:bg-red-400 hover:bg-green-400 hover:bg-gray-400
active:bg-blue-500 active:bg-red-500 active:bg-green-500 active:bg-gray-500
*/
type ButtonColor = "blue" | "red" | "green" | "gray";

export const Button = ({
    color = "blue",
    selected = false,
    solid = false,
    ...rest
}: React.HTMLAttributes<HTMLButtonElement> & {
    color?: ButtonColor;
    selected?: boolean;
    solid?: boolean;
}) => {
    let bgColorClass = "bg-transparent";
    if (solid) {
        bgColorClass = `bg-${color}-600`;
    }
    if (selected) {
        bgColorClass = `bg-${color}-400`;
    }
    const hoverColorClass = `hover:bg-${color}-400`;
    const activeColorClass = `active:bg-${color}-500`;

    return (
        <button
            {...rest}
            className={cx(
                "cursor-pointer px-4 py-2 border-slate-400 border text-white rounded ",
                bgColorClass,
                hoverColorClass,
                activeColorClass,
                rest.className
            )}
        />
    );
};
