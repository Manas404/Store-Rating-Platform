export default function Input({ label, error, className = "", ...props }) {
    return (
        <div className="space-y-1 group">

            {/* Label */}
            {label && (
                <label className="
                    block text-sm font-semibold
                    text-gray-700
                    group-focus-within:text-indigo-600
                    transition-colors duration-300
                ">
                    {label}
                </label>
            )}

            {/* Input Field */}
            <div className="relative">
                <input
                    className={`
                        w-full px-4 py-2.5
                        bg-white/80 backdrop-blur-sm
                        border rounded-xl
                        text-sm text-gray-900 placeholder-gray-400
                        shadow-sm

                        transition-all duration-300 ease-out
                        hover:border-indigo-400
                        focus:outline-none
                        focus:ring-2 focus:ring-indigo-500/40
                        focus:border-indigo-500
                        focus:shadow-lg focus:shadow-indigo-500/20

                        active:scale-[0.995]

                        [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_white]
                        [&:-webkit-autofill]:[-webkit-text-fill-color:#111827]

                        ${error
                            ? "border-red-500 focus:border-red-500 focus:ring-red-400/40"
                            : "border-gray-300"
                        }

                        ${className}
                    `}
                    {...props}
                />

                {/* Glow Effect */}
                <span className="
                    pointer-events-none absolute inset-0
                    rounded-xl opacity-0
                    group-focus-within:opacity-100
                    transition duration-500
                    bg-gradient-to-r from-indigo-500/10 to-purple-500/10
                    blur-md
                " />
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-xs text-red-600 mt-1 animate-shake">
                    {error}
                </p>
            )}

            {/* Animations */}
            <style jsx>{`
                .animate-shake {
                    animation: shake 0.35s ease;
                }

                @keyframes shake {
                    0%,100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
            `}</style>

        </div>
    );
}