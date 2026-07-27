const mockWallet = {
    "availableBalance": 12500.5000,
    "heldBalance": 2500.2500,
    "totalBalance": 15008.7500,
    "user": {
        "id": 108,
        "username": "johndoe",
        "email": "johndoe@example.com",
        "firstName": "John",
        "lastName": "Doe"
    }
}

export function getClientWallet(userId) {
    return mockWallet;
}


export function addMoneyToWallet(userId, amount) {
    const numericAmount = Number(amount) || 0;
    mockWallet.heldBalance += numericAmount;
    mockWallet.totalBalance += numericAmount;
    mockWallet.availableBalance += numericAmount;
}