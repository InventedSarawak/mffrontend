// Next.js API route to proxy requests to backend
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = searchParams.get('page') || '1'
        const limit = searchParams.get('limit') || '10'
        const search = searchParams.get('search') || ''

        // Construct backend URL
        const params = new URLSearchParams({
            page,
            limit,
            ...(search && { search }),
        })

        const backendUrl = `http://localhost:5000/api/mutualfund/list-mf?${params}`

        // Fetch from backend
        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error(`Backend API error: ${response.status}`)
        }

        const data = await response.json()

        // Return data with CORS headers
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods':
                    'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        })
    } catch (error) {
        console.error('Proxy API error:', error)

        return new Response(
            JSON.stringify({
                error: 'Failed to fetch mutual funds',
                message: error.message,
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        )
    }
}
export async function POST(request) {
    try {
      const url = new URL(request.url)
      // The pathname will be something like /api/mutualfund/[fundId]/category
      const pathParts = url.pathname.split('/').filter(Boolean)
  
      // Check if path matches the pattern: /api/mutualfund/:fundId/category
      if (
        pathParts.length === 4 &&
        pathParts[0] === 'api' &&
        pathParts[1] === 'mutualfund' &&
        pathParts[3] === 'category'
      ) {
        const fundId = pathParts[2]
  
        const body = await request.json()
        const { category } = body
  
        if (!category || category.trim() === '') {
          return new Response(
            JSON.stringify({ error: 'Category is required' }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        }
  
        // Forward the POST request to your backend
        const backendUrl = `http://localhost:5000/api/mutualfund/${fundId}/category`
  
        const backendResponse = await fetch(backendUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category }),
        })
  
        const data = await backendResponse.json()
  
        return new Response(JSON.stringify(data), {
          status: backendResponse.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        })
      }
  
      // If POST to other routes not handled, respond 404
      return new Response(
        JSON.stringify({ error: 'Not Found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    } catch (error) {
      console.error('Proxy POST error:', error)
  
      return new Response(
        JSON.stringify({ error: 'Failed to proxy POST request', message: error.message }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
    }
  }

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(request) {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    })
}
