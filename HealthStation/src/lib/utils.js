const { DEPOSIT, WITHDRAWAL, PAYMENT } = require("../constants");

module.exports = {
    getTransactionName: (action) => {
        switch (action) {
            case DEPOSIT:
                return "Nạp tiền vào tài khoản";
            case WITHDRAWAL:
                return "Rút tiền ra khỏi tài khoản";
            case PAYMENT:
                return "Thanh toán hóa đơn";

            default:
                return "Không rõ";
        }
    }
}