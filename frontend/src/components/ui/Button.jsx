
export default function Button({ children, variant = 'primary', isLoading, className = '', ...props }) {
    const baseStyle = "inline-flex justify-center items-center py-2 px-4 border text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
        primary: "border-transparent text-white bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 shadow-md shadow-indigo-500/30 focus:ring-indigo-500",
        secondary: "border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 shadow-sm focus:ring-indigo-500",
        danger: "border-transparent text-white bg-rose-500 hover:bg-rose-600 hover:-translate-y-0.5 shadow-md shadow-rose-500/30 focus:ring-rose-500",
    };

    return (
        <button className={`${baseStyle} ${variants[variant]} ${className}`} disabled={isLoading || props.disabled} {...props}>
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            )}
            {children}
        </button>
    );
}