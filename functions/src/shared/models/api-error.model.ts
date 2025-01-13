export interface ApiError extends Error {
    code?: string
    status?: number
}
