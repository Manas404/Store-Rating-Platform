export default function Button({
    children,
    variant = "primary",
    isLoading,
    className = "",
    ...props
}) {

    const baseStyle = `
        relative overflow-hidden
        inline-flex justify-center items-center
        px-5 py-2.5
        text-sm font-semibold
        rounded-xl
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        active:scale-95
        disabled:opacity-60 disabled:cursor-not-allowed
    `;

    const variants = {
        primary: `
            text-white border-transparent
            bg-gradient-to-r from-indigo-600 to-purple-600
            hover:from-purple-600 hover:to-pink-600
            hover:-translate-y-1
            shadow-lg shadow-indigo-500/30
            hover:shadow-xl hover:shadow-purple-500/40
            focus:ring-indigo-500
        `,

        secondary: `
            text-gray-700 bg-white border border-gray-200
            hover:bg-gray-50 hover:border-gray-300
            hover:-translate-y-0.5
            shadow-md
            focus:ring-indigo-500
        `,

        danger: `
            text-white border-transparent
            bg-gradient-to-r from-rose-500 to-red-600
            hover:from-red-600 hover:to-rose-700
            hover:-translate-y-1
            shadow-lg shadow-rose-500/30
            hover:shadow-xl hover:shadow-red-500/40
            focus:ring-rose-500
        `,
    };

    return (
        <button
            className={`${baseStyle} ${variants[variant]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {/* Glow Hover Effect */}
            <span className="absolute inset-0 opacity-0 hover:opacity-20 transition duration-500 bg-white blur-xl"></span>

            {/* Loading Spinner */}
            {isLoading && (
                <svg
                    className="animate-spin mr-2 h-5 w-5 text-current"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="opacity-25"
                    />
                    <path
                        fill="currentColor"
                        className="opacity-90"
                        d="M4 12a8 8 0 018-8V0C5.5 0 0 5.5 0 12h4z"
                    />
                </svg>
            )}

            {/* Button Text */}
            <span className="relative z-10 flex items-center gap-1">
                {children}
            </span>
        </button>
    );
}