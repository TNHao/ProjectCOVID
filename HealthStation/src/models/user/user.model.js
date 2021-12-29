const fakePaymentData = [
    {
        id: '1',
        name: "Thanh toán hóa đơn",
        amount: "500$",
        date: '22/12/2021'
    },
    {
        id: '2',
        name: "Thanh toán nợ",
        amount: "50$",
        date: '22/12/2021'
    },
    {
        id: '3',
        name: "Nạp tiền",
        amount: "100$",
        date: '22/12/2021'
    },
    {
        id: '4',
        name: "Thanh toán hóa đơn",
        amount: "200$",
        date: '22/12/2021'
    },
]

module.exports = {
    getProfile: async (req, res) => {
        res.render('layouts/user/profile',
            {
                layout: 'user/main',
                active: { profile: true }
            }
        )
    },
    getChangePassword: async (req, res) => {
        res.render('layouts/user/changePassword',
            {
                layout: 'user/main',
                active: { profile: true }
            }
        )
    },
    getPayment: async (req, res) => {
        res.render('layouts/user/payment',
            {
                layout: 'user/main',
                active: { payment: true },
                data: fakePaymentData
            }
        )
    },
}