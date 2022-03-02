require('dotenv').config();
module.exports = {
    API_URL: process.env.API_URL || "https://localhost:5000",
    DEPOSIT: 'Nạp',
    WITHDRAWAL: 'Rút',
    PAYMENT: 'Chuyển',
    ADMIN_ID: 0,
    PERMISSIONS: {
        admin: 1,
        activeManager: 2,
        inactiveManager: 3,
        user: 4
    }
}