type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface ApiRequestOptions {
  method?: HttpMethod
  body?: unknown
  withToken?: boolean
  cache?: RequestCache
}

export async function makeApiRequest(
  base_url: string,
  url: string,
  { method = 'POST', body, withToken = false, cache }: ApiRequestOptions = {}
) {
  const headers: Record<string, string> = {}

  const options: RequestInit = { method, headers }

  if (cache) options.cache = cache

  if (withToken) {
    const token = getAuthToken()
    headers.Authorization = `Bearer ${token}`
  }

  attachBody(options, headers, body)
  console.log(`Making API Request to *****${base_url}${url} *****`)

  try {
    const response = await fetch(`${base_url}${url}`, options)

    if (response.status === 401 && withToken) {
      handleUnauthorized()
    }

    if (response.status >= 500) {
      return {
        ok: false,
        status: response.status,
        json: async () => ({ detail: 'Service Unavailable' }),
      }
    }

    return response
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network unreachable'
    return {
      ok: false,
      status: 0,
      networkError: true,
      message,
      json: async () => ({ detail: message }),
    }
  }
}

// -----------Helper functions-----------------

function attachBody(options: RequestInit, headers: Record<string, string>, body?: unknown) {
  if (!body) return

  if (body instanceof FormData) {
    options.body = body
    return
  }

  headers['Content-Type'] = 'application/json'
  options.body = JSON.stringify(body)
}

function getAuthToken(): string {
  return (
    document.cookie
      .split('; ')
      .find(c => c.startsWith('access_token='))
      ?.split('=')[1] ?? '_'
  )
}

function handleUnauthorized(): never {
  clearAuthCookies()
  window.location.href = '/'
  throw new Error('Authentication expired')
}

function clearAuthCookies() {
  const expired = `expires=${new Date(0).toUTCString()}; path=/;`
  document.cookie = `access_token=; ${expired}`
  document.cookie = `refreshToken=; ${expired}`
  document.cookie = `userId=; ${expired}`
}
