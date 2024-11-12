// utils.js

// Save tokens to localStorage
export const setTokens = (access_token, refresh_token) => {
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)
}

// Retrieve access token from localStorage
export const getAccessToken = () => {
    return localStorage.getItem('access_token')
}

// Retrieve refresh token from localStorage
export const getRefreshToken = () => {
    return localStorage.getItem('refresh_token')
}

// Clear tokens from localStorage
export const clearTokens = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
}

// Utility function to check if the user is authenticated
export const isAuthenticated = () => {
    return !!getAccessToken() // Returns true if access token exists
}

// Utility function to check if the user is authenticated
export function isAdmin(user) {
    if (!user) return false

    // Kiểm tra trong danh sách roles
    if (user.roles && user.roles.some((role) => role.authority === 'ADMIN')) {
        return true
    }

    // Kiểm tra trong danh sách authorities
    if (
        user.authorities &&
        user.authorities.some((auth) => auth.authority === 'ADMIN')
    ) {
        return true
    }

    return false
}

// Utility function to check if the user is authenticated
export function isAuth(user) {
    if (!user) return false

    // Kiểm tra trong danh sách roles
    if (user) {
        return true
    }
    return false
}
