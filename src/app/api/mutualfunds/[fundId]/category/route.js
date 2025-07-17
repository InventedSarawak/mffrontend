export async function POST(request, { params }) {
    const { fundId } = params
  
    try {
      const { category } = await request.json()
  
      if (!category || category.trim() === '') {
        return new Response(
          JSON.stringify({ error: 'Category is required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }
  
      // Proxy to backend
      const backendRes = await fetch(`http://localhost:5000/api/mutualfund/${fundId}/category`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category }),
      })
  
      const data = await backendRes.json()
      console.log(data)
      return new Response(JSON.stringify(data), {
        status: backendRes.status,
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('Error proxying category POST:', error)
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }
  