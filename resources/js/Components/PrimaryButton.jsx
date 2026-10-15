export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center border border-transparent bg-black px-5 py-3 text-[10px] font-medium uppercase tracking-[0.14em] text-white transition duration-150 ease-in-out hover:bg-black/80 focus:bg-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 active:bg-black ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
