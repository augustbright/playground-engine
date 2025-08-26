import cx from "classnames";

export const Button = ({
    ...rest
}: React.HTMLAttributes<HTMLButtonElement>) => {
    return (
        <button
            {...rest}
            className={cx(
                "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",
                rest.className
            )}
        />
    );
};
