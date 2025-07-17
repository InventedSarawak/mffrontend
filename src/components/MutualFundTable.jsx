'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { useMutualFunds } from '../hooks/useMutualFunds'
import MoreOptionsMenu from './MoreOptionsMenu'
import AddCategoryModal from './AddCategoryModal'
import CategoryModal from './AddCategoryModal'
import { MoreVertical , Plus} from 'lucide-react';
ModuleRegistry.registerModules([AllCommunityModule])

const PAGE_SIZE = 100

export default function MutualFundsPage() {
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const { data, loading, error } = useMutualFunds({ page: 1, limit: 14000 })
    const [modalOpen, setModalOpen] = useState(false)
const [selectedFund, setSelectedFund] = useState(null)

const handleAddCategory = (fund) => {
  setSelectedFund(fund)
  setModalOpen(true)
}

const handleSaveCategory = async (fund, category) => {
    if (!category || category.trim() === '') return
  
    try {
      await fetch(`/api/mutualfunds/${fund._id}/category`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: category.trim() }),
      })
      // Optionally: refresh data or update local state here
    } catch (err) {
      console.error('Failed to add category', err)
    }
  }
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search)
        }, 300)
        return () => clearTimeout(handler)
    }, [search])

    const columnDefs = [
        { headerName: 'ISIN', field: 'isin' },
        { headerName: 'Name', field: 'name', flex: 1 },
        {
            headerName: 'Category',
            field: 'category',
            valueFormatter: ({ value }) =>
                Array.isArray(value) ? value.join(', ') : '',
            flex: 1,
        },
        { headerName: 'NAV', field: 'nav' },
        {
            headerName: 'Date',
            field: 'navDate',
            valueFormatter: ({ value }) =>
                value ? new Date(value).toLocaleDateString() : '',
        },

        {
            headerName: '',
            field: 'actions',
            cellRenderer: ({ data }) => (
              <button
                    onClick={() => {handleAddCategory(data) ; console.log("clicked")}}
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                <Plus size={16} className="mr-1" />
                Add Category
              </button>
            ),
            width: 160,
          }
        

    ]

    const filteredData = useMemo(() => {
        if (!search) return data?.mutualFunds || []
        const searchLower = search.toLowerCase()
        return (data?.mutualFunds || []).filter((fund) =>
            fund.name?.toLowerCase().includes(searchLower) ||
            fund.isin?.toLowerCase().includes(searchLower)
        )
    }, [search, data])

    return (
        <div className="ag-theme-alpine text-black bg-white p-4">
            <h2 className="text-xl mb-4 font-semibold">Mutual Funds</h2>

            <input
                type="text"
                placeholder="Search by Name or ISIN"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border px-3 py-2 rounded w-full max-w-md mb-4"
            />

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            <div className="ag-theme-alpine" style={{ height: 700, width: '100%' }}>
                <AgGridReact
                    rowData={filteredData}
                    columnDefs={columnDefs}
                    pagination={true}
                    paginationPageSize={PAGE_SIZE}
                    domLayout="autoHeight"
                />
            </div>
            <CategoryModal
  fund={selectedFund}
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
  onSave={(fund, category) => {
    handleSaveCategory(fund, category)
    setModalOpen(false)
  }}
/>

        </div>
        
    )
    

}
