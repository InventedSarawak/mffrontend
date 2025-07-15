'use client'

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage,
}) => {
    const getVisiblePages = () => {
        const maxVisible = 7
        const halfVisible = Math.floor(maxVisible / 2)

        let startPage = Math.max(1, currentPage - halfVisible)
        let endPage = Math.min(totalPages, startPage + maxVisible - 1)

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1)
        }

        return Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
        )
    }

    const visiblePages = getVisiblePages()
    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    const PageButton = ({
        page,
        isActive,
        onClick,
        children,
        disabled = false,
    }) => (
        <button
            onClick={() => !disabled && onClick(page)}
            disabled={disabled}
            className={`
        relative inline-flex items-center px-4 py-2 text-sm font-medium border
        ${
            isActive
                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                : disabled
                ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
        }
        ${
            !disabled
                ? 'focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                : ''
        }
      `}
        >
            {children}
        </button>
    )

    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-between">
            {/* Results info */}
            <div className="flex-1 flex justify-between sm:hidden">
                <PageButton
                    page={currentPage - 1}
                    onClick={onPageChange}
                    disabled={currentPage <= 1}
                >
                    Previous
                </PageButton>
                <PageButton
                    page={currentPage + 1}
                    onClick={onPageChange}
                    disabled={currentPage >= totalPages}
                >
                    Next
                </PageButton>
            </div>

            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{startItem}</span>{' '}
                        to <span className="font-medium">{endItem}</span> of{' '}
                        <span className="font-medium">{totalItems}</span>{' '}
                        results
                    </p>
                </div>

                <div>
                    <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                    >
                        {/* Previous button */}
                        <PageButton
                            page={currentPage - 1}
                            onClick={onPageChange}
                            disabled={currentPage <= 1}
                        >
                            <span className="sr-only">Previous</span>
                            <svg
                                className="h-5 w-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </PageButton>

                        {/* First page and ellipsis */}
                        {visiblePages[0] > 1 && (
                            <>
                                <PageButton
                                    page={1}
                                    onClick={onPageChange}
                                    isActive={currentPage === 1}
                                >
                                    1
                                </PageButton>
                                {visiblePages[0] > 2 && (
                                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                        ...
                                    </span>
                                )}
                            </>
                        )}

                        {/* Page numbers */}
                        {visiblePages.map((page) => (
                            <PageButton
                                key={page}
                                page={page}
                                onClick={onPageChange}
                                isActive={currentPage === page}
                            >
                                {page}
                            </PageButton>
                        ))}

                        {/* Last page and ellipsis */}
                        {visiblePages[visiblePages.length - 1] < totalPages && (
                            <>
                                {visiblePages[visiblePages.length - 1] <
                                    totalPages - 1 && (
                                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                        ...
                                    </span>
                                )}
                                <PageButton
                                    page={totalPages}
                                    onClick={onPageChange}
                                    isActive={currentPage === totalPages}
                                >
                                    {totalPages}
                                </PageButton>
                            </>
                        )}

                        {/* Next button */}
                        <PageButton
                            page={currentPage + 1}
                            onClick={onPageChange}
                            disabled={currentPage >= totalPages}
                        >
                            <span className="sr-only">Next</span>
                            <svg
                                className="h-5 w-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </PageButton>
                    </nav>
                </div>
            </div>
        </div>
    )
}

export default Pagination
