'use client'

import { useState } from 'react'

const defaultCategories = ['Large Cap', 'Mid Cap', 'Small Cap', 'Debt', 'ELSS', 'Index']

export default function AddCategoryModal({ isOpen, onClose, onSave, fund }) {
    const [custom, setCustom] = useState('')

    if (!isOpen) return null

    const handleSave = () => {
        if (custom.trim()) {
            onSave(fund, custom.trim())
            setCustom('')
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-xl font-semibold mb-4">Add Category</h2>

                <input
                    type="text"
                    placeholder="Enter category name"
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    className="w-full border px-3 py-2 mb-3 rounded focus:outline-none focus:ring focus:border-blue-500"
                />

                {custom === '' && (
                    <div className="text-sm text-gray-500 mb-3">
                        Suggested: {defaultCategories.join(', ')}
                    </div>
                )}

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}
