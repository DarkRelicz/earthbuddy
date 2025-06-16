import React from 'react'

interface InputProps {
    label: string;
    id: string;
    type: string
    value: string;
    onChangeCallBack: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    borderColour?: string;
}

function Input({ label, id, type, value, onChangeCallBack, placeholder, borderColour='border-gray-300' }: InputProps) {
    return (
        <>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                id={id}
                name={id}
                type={type}
                value={value}
                onChange={onChangeCallBack}
                className={`w-full px-3 py-2 border ${borderColour} rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder={placeholder}
                required
            />
        </>
    )
}

export default Input