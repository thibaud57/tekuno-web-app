// Firebase Auth mocks
export const mockAuth = {
    listUsers: jest.fn(),
    getUser: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    setCustomUserClaims: jest.fn(),
}

// Firestore mocks
export const mockCollection = jest.fn()
export const mockDoc = jest.fn()
export const mockAdd = jest.fn()
export const mockUpdate = jest.fn()
export const mockDelete = jest.fn()
export const mockWhere = jest.fn()
export const mockLimit = jest.fn()
export const mockGet = jest.fn()

// Firebase Admin mock
export const mockFirebaseAdmin = {
    auth: () => mockAuth,
    firestore: () => ({
        collection: mockCollection,
        Timestamp: {
            now: () => ({ seconds: 1234567890, nanoseconds: 0 }),
        },
    }),
}

// Setup Firestore chain mocks
export const setupFirestoreMocks = () => {
    mockCollection.mockReturnValue({
        doc: mockDoc,
        add: mockAdd,
        where: mockWhere,
        get: mockGet,
    })
    mockDoc.mockReturnValue({
        get: mockGet,
        update: mockUpdate,
        delete: mockDelete,
    })
    mockWhere.mockReturnValue({
        limit: mockLimit,
    })
    mockLimit.mockReturnValue({
        get: mockGet,
    })
}

// Reset all Firebase mocks
export const resetFirebaseMocks = () => {
    // Reset Auth mocks
    mockAuth.listUsers.mockReset()
    mockAuth.getUser.mockReset()
    mockAuth.createUser.mockReset()
    mockAuth.updateUser.mockReset()
    mockAuth.deleteUser.mockReset()
    mockAuth.setCustomUserClaims.mockReset()

    // Reset Firestore mocks
    mockCollection.mockReset()
    mockDoc.mockReset()
    mockAdd.mockReset()
    mockUpdate.mockReset()
    mockDelete.mockReset()
    mockWhere.mockReset()
    mockLimit.mockReset()
    mockGet.mockReset()
}
