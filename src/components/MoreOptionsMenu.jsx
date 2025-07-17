// components/MoreOptionsMenu.js
'use client'

import { useState } from 'react'
import { MoreVertical } from 'lucide-react'

export default function MoreOptionsMenu({ fund, onAddCategory }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative">
            <button
                onClick={() => {setIsOpen(!isOpen)}}
                className="text-gray-600 hover:text-black cursor-pointer"
            >
                <MoreVertical size={18} />
            </button>
            {true && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded z-50">
                    <button
                        onClick={() => {
                            onAddCategory(fund)
                            setIsOpen(false)
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                        Add Category
                    </button>
                </div>
            )}
        </div>
    )
}
