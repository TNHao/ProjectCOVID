const userModel = require('../../models/user/user.model');
const orderModel = require('../../models/sites/order.model')
const productModel = require('../../models/sites/product.model')
const minimumPaymentModel = require('../../models/sites/minimumPayment.model')

const { PAYMENT } = require('../../constants/index')
const moment = require('moment')

const logModel = require('../../models/sites/log.model');
const { isValidPassword, callBankingApi } = require('../../lib/utils')

const fakePaymentData = [
    {
        transaction_id: '1',
        action: "Thanh toán hóa đơn",
        amount: "500$",
        date: '22/12/2021'
    },
    {
        transaction_id: '2',
        action: "Thanh toán nợ",
        amount: "50$",
        date: '22/12/2021'
    },
    {
        transaction_id: '3',
        action: "Nạp tiền",
        amount: "100$",
        date: '22/12/2021'
    },
    {
        transaction_id: '4',
        action: "Thanh toán hóa đơn",
        amount: "200$",
        date: '22/12/2021'
    },
]

const fakePurchaseData = [
    {
        detail_id: '1',
        order_id: '1',
        amount: '5',
        total: '200$',
        package_name: 'Gói hỗ trợ 69',
        create_at: '22/12/2021'
    },
    {
        detail_id: '2',
        order_id: '1',
        amount: '5',
        total: '200$',
        package_name: 'Gói hỗ trợ 70',
        create_at: '22/12/2021'
    },
    {
        detail_id: '3',
        order_id: '2',
        amount: '3',
        total: '100$',
        package_name: 'Gói hỗ trợ 12',
        create_at: '22/12/2021'
    },
    {
        detail_id: '4',
        order_id: '2',
        amount: '1',
        total: '500$',
        package_name: 'Gói hỗ trợ 23',
        create_at: '22/12/2021'
    },
    {
        detail_id: '5',
        order_id: '3',
        amount: '4',
        total: '700$',
        package_name: 'Gói hỗ trợ 45',
        create_at: '22/12/2021'
    },
]

const fakeManagementData = [
    {
        type: 'Thêm mới',
        description: 'Được thêm vào danh sách những ca bệnh',
        create_at: '22/12/2021',
    },
    {
        type: 'Chuyển nơi điều trị',
        description: 'Chuyền từ khu cách ly A sang khu cách ly B',
        create_at: '22/12/2021',
    },
    {
        type: 'Thay đổi trạng thái',
        description: 'Chuyền từ trạng thái F0 thành trạng thái F1',
        create_at: '22/12/2021',
    },
    {
        type: 'Chuyển nơi điều trị',
        description: 'Chuyền từ khu cách ly B sang khu cách ly C',
        create_at: '22/12/2021',
    },
    {
        type: 'Xuất viện',
        description: 'Được trở về từ khu cách ly',
        create_at: '22/12/2021',
    },
]

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJpYXQiOjE2NDEwNTc2MTY1OTksImV4cCI6MTY0MTA1NzcwMjk5OX0.cdTrTbGwUt-3PJw3jeav8UfM2BEM9iFXa8GySM7prMM"

module.exports = {
    getProfile: async (req, res) => {
        const { id } = req.params;
        let { data: profile } = await userModel.findById(id);
        const { data: quarantineLocation } = await userModel.getUserQuarantineLocation(id);

        profile = { ...profile, quarantineLocation }
        profile.dob = moment(profile.dob).format('YYYY-MM-DD')
        console.log('profile', profile);
        res.render('layouts/user/profile',
            {
                layout: 'user/main',
                active: { profile: true },
                id,
                profile,
            }
        )
    },
    getChangePassword: async (req, res) => {
        const { id } = req.params;
        const message = req.session.message || {};
        req.session.message = null;
        res.render('layouts/user/changePassword',
            {
                layout: 'user/main',
                active: { profile: true },
                id,
                message
            }
        )
    },
    postChangePassword: async (req, res) => {
        const { id } = req.params;
        const { password, newPassword, password_confirmation } = req.body

        let message = {
            content: 'Đổi mật khẩu thành công!',
            status: 'success'
        }
        // confirm password does not match
        if (newPassword !== password_confirmation) {
            message = {
                content: 'Mật khẩu nhập lại không chính xác!',
                status: 'danger'
            }
        } else {
            const { data: user } = await userModel.findById(id)
            const isValid = await isValidPassword(password, user.password)
            if (!isValid) {
                message = {
                    content: 'Mật khẩu hiện tại không chính xác!',
                    status: 'danger'
                }
            } else {
                await userModel.updatePasswordById(id, newPassword)
            }
        }

        req.session.message = message;
        return res.redirect(`/user/${id}/change-password`);
    },

    order: async(req, res, next) => {
        const { account_id } = req.user;
        const { data: user } = await userModel.findById(account_id)
        const { banking_token } = user;
        
        // check if payment account exists
        if(!banking_token) {
            req.session.message = {
                status: 'danger',
                content: 'Vui lòng liên kết tài khoản trước khi thanh toán.'
            }
            return res.redirect(`/user/${account_id}/payment`)
        }

        const { data: response } = await userModel.getBalance(account_id, banking_token);
        const balance = Number(response.balance);
        const { data: minimumPaymentAmount } = await minimumPaymentModel.find();
        const { total, package_name, package_id, ...products } = req.body;

        // check if exceeding the minimum payment
        if((balance - Number(total)) * -1 > Number(minimumPaymentAmount)) {
            req.session.message = {
                status: 'danger',
                content: 'Vượt quá hạn mức thanh toán, vui lòng nạp thêm vào tài khoản.'
            }
            return res.redirect(`/user/${account_id}/payment`)
        }

        // TODO: check if exceeding number of package per person in the period
        // if(false) {
        //     req.session.message = {
        //         status: 'danger',
        //         content: 'Vượt quá số lần mua gói nhu yếu phẩm, vui lòng chọn gói khác.'
        //     }
        //     return res.redirect(`/user/${account_id}/payment`)
        // }

        const order = { account_id, total }
        const package = {
            package_name,
            package_id,
            amount: 1,
            price: total
        }

        const necessaries = []
        for (const [productId, productInfo] of Object.entries(products)) {
           const { data: necessary } = await productModel.findById(productId)
           necessary.necessary_name = necessary.name
           necessary.amount = productInfo[0]
           necessary.price = productInfo[1]
           necessaries.push(necessary)
        }
       package.necessaries = necessaries;
       const packages = []
       packages.push(package)
       try {
           await orderModel.createOrder(order, packages)
           const paymentResponse = await callBankingApi(
               '/api/transactions/payment', 'POST',
               {
                   send_id: account_id,
                   amount: total,
                   action: PAYMENT
                },
                banking_token)
                
           return res.redirect('/')
       } catch(err) {
           console.log(err);
           return res.redirect('/404')
       }
    }, 

    getPayment: async (req, res) => {
        const { id } = req.params;

        const { data: user } = await userModel.findById(id);
        const { banking_token: token } = user;

        let data = {};
        let userBankingDetail = {};

        if (token) {
            data = (await userModel.getPaymentData(id, token)).data;
            userBankingDetail = (await userModel.getBalance(id, token)).data;
        }

        const message = req.session.message;
        req.session.message = null;
        console.log(message);

        const { data: isVerified } = await userModel.checkVerify(id)

        balance = Number(userBankingDetail.balance);
        const isDebt = balance < 0;
        res.render('layouts/user/payment',
            {
                layout: 'user/main',
                active: { payment: true },
                data: data || null,
                balance: Math.abs(balance) || "---",
                isDebt: isDebt,
                isVerified,
                isLoggedIn: token ? true : false,
                id,
                message
            }
        )
    },
    getManagement: async (req, res) => {
        const { id } = req.params;
        const { data } = await logModel.findByUserId(id)

        let isEmpty = false;
        if (data.length === 0)
            isEmpty = true;

        res.render('layouts/user/management',
            {
                layout: 'user/main',
                active: { management: true },
                data: fakeManagementData,
                isEmpty,
                id
            }
        )
    },
    getPurchase: async (req, res) => {
        const { id } = req.params;
        let { data = [] } = await orderModel.findOrderByAccountID(id);

        let isEmpty = false;
        if (data.length === 0)
            isEmpty = true;

        data = data.map(detail => ({ ...detail, create_at: moment(detail.create_at).format('YYYY-MM-DD') }))

        // res.json(data);
        res.render('layouts/user/purchase',
            {
                layout: 'user/main',
                active: { purchase: true },
                data: data,
                isEmpty,
                id
            }
        )
    },
    getOrderDetail: async (req, res) => {
        const { id, orderId } = req.params;
        const { data } = await orderModel.findOrderByID(orderId);

        console.log("order:", data);

        const package = data[0].packages[0];

        package.necessaries = package.necessaries.map(necessary => ({ ...necessary, total: Number(necessary.price) * Number(necessary.amount) }))

        res.render('layouts/user/orderDetail',
            {
                layout: 'user/main',
                active: { purchase: true },
                package,
                id
            }
        )
    },
    deposit: async (req, res) => {
        const { amount, send_id } = req.body;
        const { data } = await userModel.deposit(send_id, amount, token);
        res.redirect(`/user/${send_id}/payment`);
    },
    setToken: async (req, res) => {
        const { token } = req.body;
        const { id } = req.params;

        await userModel.setToken(id, token);

        res.redirect(`/user/${id}/payment`);
    }
}