type ApiErrorBody = { code?: string; message?: string }

export const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3333'

export async function apiRequest<T>(input: {
  path: string
  method?: 'GET' | 'POST'
  body?: unknown
  token?: string | null
}): Promise<T> {
  const headers: Record<string, string> = {}
  if (input.body) headers['content-type'] = 'application/json'
  if (input.token) headers.authorization = `Bearer ${input.token}`

  const res = await fetch(`${API_BASE_URL}${input.path}`, {
    method: input.method ?? 'GET',
    headers,
    body: input.body ? JSON.stringify(input.body) : undefined,
  })

  if (res.ok) return (await res.json()) as T

  let data: ApiErrorBody | null = null
  try {
    data = (await res.json()) as ApiErrorBody
  } catch {
    data = null
  }

  const message = data?.message || `Erro HTTP ${res.status}`
  throw new Error(message)
}
