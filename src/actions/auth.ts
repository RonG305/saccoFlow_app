import { BASE_URLS } from "@/api/base"
import { makeApiRequest } from "@/api/main"
import type { RegisterUserData } from "@/types/auth"

export const registerUser = async (userData: RegisterUserData) => {
    console.log("Registering user with data: ", userData)
    const response = await makeApiRequest(BASE_URLS.AUTH_URL, `/register/`, {
        method: 'POST',
        body: userData,
    })

    const data = await response?.json()
    console.log("Register user: ", data)

    if (!response?.ok) {
        const errorData = data || {}
        return {
            error: errorData?.message || errorData?.error || 'Failed to create user account'
        }
    }
    return data
}

export const loginUser = async (email: string, password: string, organizationId?: string) => {
    const body: Record<string, string> = { email, password }
    if (organizationId) body.organization_id = organizationId

    const response = await makeApiRequest(BASE_URLS.AUTH_URL, `/login/`, {
        method: 'POST',
        body,
    })

    const data = await response?.json()
    console.log("Login Response Data: ", data)

    if (!response?.ok) {
        const errorData = data || {}
        return {
            error: errorData?.message || errorData?.error || 'Failed to login'
        }
    }

    document.cookie = `access_token=${data.accessToken}; path=/; SameSite=Lax`
    return data
}

export const updateUser = async (id: string, userData: Partial<RegisterUserData>) => {
    const response = await makeApiRequest(BASE_URLS.AUTH_URL, `/users/${id}/update/`, {
        method: 'PATCH',
        withToken: true,
        body: userData,
    })
    const data = await response?.json()
    if (!response?.ok) {
        return { error: data?.message || data?.error || 'Failed to update user' }
    }
    return data
}

export const activateUser = async (id: string) => {
    const response = await makeApiRequest(BASE_URLS.AUTH_URL, `/users/${id}/activate/`, {
        method: 'PATCH',
        withToken: true,
    })
    if (!response?.ok) {
        const data = await response?.json().catch(() => null)
        return { error: data?.message || data?.error || 'Failed to activate user' }
    }
    return { success: true }
}

export const deactivateUser = async (id: string) => {
    const response = await makeApiRequest(BASE_URLS.AUTH_URL, `/users/${id}/deactivate/`, {
        method: 'PATCH',
        withToken: true,
    })
    if (!response?.ok) {
        const data = await response?.json().catch(() => null)
        return { error: data?.message || data?.error || 'Failed to deactivate user' }
    }
    return { success: true }
}

export const deleteUser = async (id: string) => {
    const response = await makeApiRequest(BASE_URLS.AUTH_URL, `/users/${id}/delete/`, {
        method: 'DELETE',
        withToken: true,
    })
    if (!response?.ok) {
        const data = await response?.json().catch(() => null)
        return { error: data?.message || data?.error || 'Failed to delete user' }
    }
    return { success: true }
}

export const logoutUser = () => {
    const expired = `expires=${new Date(0).toUTCString()}; path=/;`
    document.cookie = `access_token=; ${expired}`
    document.cookie = `token=; ${expired}`
    document.cookie = `refreshToken=; ${expired}`
    document.cookie = `userId=; ${expired}`
}
