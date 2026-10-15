export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-[10px] font-medium uppercase tracking-[0.1em] text-gray-700 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
