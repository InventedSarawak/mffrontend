'use client'

const TableHeader = () => {
    const headers = [
        { key: 'isin', label: 'ISIN', width: 'w-32' },
        { key: 'name', label: 'Fund Name', width: 'w-64' },
        { key: 'assetClass', label: 'Asset Class', width: 'w-32' },
        { key: 'fundType', label: 'Fund Type', width: 'w-32' },
        { key: 'subCategory', label: 'Sub Category', width: 'w-40' },
        { key: 'nav', label: 'NAV', width: 'w-24' },
        { key: 'navDate', label: 'NAV Date', width: 'w-32' },
    ]

    return (
        <thead className="bg-gray-50">
            <tr>
                {headers.map((header) => (
                    <th
                        key={header.key}
                        scope="col"
                        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${header.width}`}
                    >
                        {header.label}
                    </th>
                ))}
            </tr>
        </thead>
    )
}

export default TableHeader
