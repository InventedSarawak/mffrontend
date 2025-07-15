'use client'

import { useState, useEffect, useCallback } from 'react'

export const useMutualFunds = ({ page = 1, limit = 10, search = '' }) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchMutualFunds = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            // Construct URL with parameters
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(search && { search }),
            })

            const response = await fetch(`/api/mutualfunds?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(
                    `HTTP error! status: ${response.status}, message: ${errorText}`
                )
            }

            const result = await response.json()

            // Handle different possible response structures
            let mutualFunds, totalCount, totalPages

            if (Array.isArray(result)) {
                // If response is directly an array
                mutualFunds = result
                totalCount = result.length
                totalPages = 1
            } else if (result.data && Array.isArray(result.data)) {
                // If response has a data property with array
                mutualFunds = result.data
                totalCount =
                    result.total || result.totalCount || result.data.length
                totalPages = result.totalPages || Math.ceil(totalCount / limit)
            } else if (
                result.mutualFunds &&
                Array.isArray(result.mutualFunds)
            ) {
                // If response has mutualFunds property
                mutualFunds = result.mutualFunds
                totalCount =
                    result.total ||
                    result.totalCount ||
                    result.mutualFunds.length
                totalPages = result.totalPages || Math.ceil(totalCount / limit)
            } else {
                // Fallback: try to find any array in the response
                const arrayKey = Object.keys(result).find((key) =>
                    Array.isArray(result[key])
                )
                mutualFunds = arrayKey ? result[arrayKey] : []
                totalCount =
                    result.total || result.totalCount || mutualFunds.length
                totalPages = result.totalPages || Math.ceil(totalCount / limit)
            }

            setData({
                mutualFunds,
                totalCount,
                totalPages,
                currentPage: page,
            })
        } catch (err) {
            console.error('Error fetching mutual funds:', err)

            let errorMessage = 'Failed to fetch mutual funds'

            if (err.name === 'TypeError' && err.message.includes('fetch')) {
                errorMessage =
                    'Unable to connect to the API. Please check if the backend server is running.'
            } else if (err.message.includes('CORS')) {
                errorMessage =
                    'CORS error: The server needs to allow requests from this domain'
            } else if (err.message) {
                errorMessage = err.message
            }

            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [page, limit, search])

    const refetch = useCallback(() => {
        fetchMutualFunds()
    }, [fetchMutualFunds])

    useEffect(() => {
        fetchMutualFunds()
    }, [fetchMutualFunds])

    return {
        data,
        loading,
        error,
        refetch,
    }
}
