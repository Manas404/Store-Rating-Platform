
export default function Input({ label, error, ...props }) {
    return (
        <div className="space-y-1">
            {label && <label className="block text-sm font-medium text-blue-800">{label}</label>}
            <input
                className={`block w-full px-4 py-2 bg-white border rounded-lg text-sm text-gray-900 placeholder-gray-500
                focus:outline-none focus:border-blue-600 transition-colors
                [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_white] [&:-webkit-autofill]:[-webkit-text-fill-color:#111827]
                ${error ? 'border-red-500 focus:border-red-600' : 'border-gray-300'}`}
                {...props}
            />
            {error && <p className="text-xs text-red-700 mt-1">{error}</p>}
        </div>
    );
}