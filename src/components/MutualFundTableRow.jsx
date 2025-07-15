'use client'

const MutualFundTableRow = ({ fund, index }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        try {
            const date = new Date(dateString)
            // Use a more consistent format to avoid hydration mismatches
            const year = date.getFullYear()
            const month = date.toLocaleDateString('en-US', { month: 'short' })
            const day = date.getDate().toString().padStart(2, '0')
            return `${day} ${month} ${year}`
        } catch (error) {
            return dateString
        }
    }

    const formatNAV = (nav) => {
        if (!nav) return 'N/A'
        const navValue = parseFloat(nav)
        return isNaN(navValue) ? nav : `₹${navValue.toFixed(2)}`
    }

    return (
        <tr
            className={`${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
            } hover:bg-blue-50 transition-colors duration-150`}
        >
            {/* ISIN */}
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {fund.isin || 'N/A'}
            </td>

            {/* Fund Name */}
            <td className="px-6 py-4 text-sm text-gray-900">
                <div className="max-w-xs">
                    <div className="font-medium truncate" title={fund.name}>
                        {fund.name || 'N/A'}
                    </div>
                </div>
            </td>

            {/* Asset Class */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {fund.category?.assetClass || 'N/A'}
                </span>
            </td>

            {/* Fund Type */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {fund.category?.fundType || 'N/A'}
                </span>
            </td>

            {/* Sub Category */}
            <td className="px-6 py-4 text-sm text-gray-900">
                <div
                    className="max-w-xs truncate"
                    title={fund.category?.subCategory}
                >
                    {fund.category?.subCategory || 'N/A'}
                </div>
            </td>

            {/* NAV */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                {formatNAV(fund.nav)}
            </td>

            {/* NAV Date */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(fund.navDate)}
            </td>
        </tr>
    )
}

export default MutualFundTableRow
