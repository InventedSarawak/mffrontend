'use client'

import { useState, useEffect, useCallback } from 'react'
import { useMutualFunds } from '../hooks/useMutualFunds'
import SearchBar from './SearchBar'
import MutualFundTableRow from './MutualFundTableRow'
import Pagination from './Pagination'
import TableHeader from './TableHeader'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'

const MutualFundTable = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState('')
    const [limit] = useState(10) // Number of items per page

    const { data, loading, error, refetch } = useMutualFunds({
        page: currentPage,
        limit,
        search: searchQuery,
    })

    const handleSearch = useCallback((query) => {
        setSearchQuery(query)
        setCurrentPage(1) // Reset to first page when searching
    }, [])

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page)
    }, [])

    const handleRefresh = useCallback(() => {
        refetch()
    }, [refetch])

    if (loading && !data) {
        return <LoadingSpinner />
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={handleRefresh} />
    }

    const { mutualFunds = [], totalCount = 0, totalPages = 0 } = data || {}

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header Section */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Mutual Funds ({totalCount} funds)
                    </h1>

                    {/* Search Bar */}
                    <SearchBar
                        onSearch={handleSearch}
                        placeholder="Search by fund name, ISIN, or category..."
                        className="w-full max-w-md"
                    />
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <TableHeader />
                        <tbody className="bg-white divide-y divide-gray-200">
                            {mutualFunds.length > 0 ? (
                                mutualFunds.map((fund, index) => (
                                    <MutualFundTableRow
                                        key={fund.isin || index}
                                        fund={fund}
                                        index={index}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-6 py-8 text-center text-gray-500"
                                    >
                                        {searchQuery
                                            ? 'No mutual funds found for your search.'
                                            : 'No mutual funds available.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Section */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            totalItems={totalCount}
                            itemsPerPage={limit}
                        />
                    </div>
                )}

                {/* Simple Previous/Next Navigation */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage <= 1}
                                className={`
                                    inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                                    ${
                                        currentPage <= 1
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-gray-900 shadow-sm'
                                    }
                                `}
                            >
                                <svg
                                    className="mr-2 h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                                Previous
                            </button>

                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <span>
                                    Page {currentPage} of {totalPages}
                                </span>
                                <span className="text-gray-400">•</span>
                                <span>{totalCount} total items</span>
                            </div>

                            <button
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={currentPage >= totalPages}
                                className={`
                                    inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                                    ${
                                        currentPage >= totalPages
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-gray-900 shadow-sm'
                                    }
                                `}
                            >
                                Next
                                <svg
                                    className="ml-2 h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Loading overlay for subsequent requests */}
                {loading && data && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                        <LoadingSpinner size="sm" />
                    </div>
                )}
            </div>
        </div>
    )
}

export default MutualFundTable
