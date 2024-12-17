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
export const isAdmin = (user) => {
    if (!user || !user.roles) return false; // Kiểm tra user hợp lệ
    return user.roles.some((role) => role.name === "ADMIN");
};

// Utility function to check if the user is authenticated
export function isAuth(user) {
    if (!user) return false

    // Kiểm tra trong danh sách roles
    if (user) {
        return true
    }
    return false
}

export function isCorrect(selectedChoiceId, choices) {
    if (!selectedChoiceId) return false; // If no choice is selected, return false
    const correctChoice = choices.find(choice => choice.isCorrect); // Assuming choices have an `isCorrect` field
    return correctChoice && correctChoice.id === selectedChoiceId; // Compare with selected choice
}
