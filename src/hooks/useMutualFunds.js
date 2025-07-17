'use client'

import { useState, useEffect, useCallback } from 'react'

export const useMutualFunds = ({ page = 1, limit = 100, search = '' }) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchMutualFunds = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(search && { search }),
            })

            const response = await fetch(`/api/mutualfunds?${params}`)
            const result = await response.json()

            const mutualFunds = result.mutualFunds || result.data || []
            const totalCount = result.total || result.totalCount || 0
            const totalPages = Math.ceil(totalCount / limit)

            setData({
                mutualFunds,
                totalCount,
                totalPages,
                currentPage: page,
            })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [page, limit, search])

    useEffect(() => {
        fetchMutualFunds()
    }, [fetchMutualFunds])

    return { data, loading, error }
}
