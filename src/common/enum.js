const Enum = require('enum');
const userTypeEnums = new Enum({ 'user': 1, 'owner': 2, 'admin': 3 }, { ignoreCase: true });
const statusEnums = new Enum({ 'active': 1, 'inactive': 2 });
const otpEnums = new Enum({ 'registration': 1, 'resetPassword': 2, 'kyc': 3 });
const paymentMethodEnums = new Enum({ 'cash': 1, 'tab': 2, 'card': 3 });
const productEntryEnums = new Enum({ 'manual': 1, 'barcode': 2 });
const paymentStatusEnums = new Enum({ 'paid': 1, 'unpaid': 2, 'partial': 3 });
const genderEnums = new Enum({ 'male': 1, 'female': 2, 'prefer not to say': 3 });
const kycEnums = new Enum({ 'botswanaId': 1, 'IntlPassport': 2 });
const productTypeEnums = new Enum({ 'main': 1, 'option': 2 });
const paymentGatewayEnums = new Enum({ 'visa': 1 });
const statisticEnums = new Enum({ 'good': 1, 'average': 2, 'bad': 3 });
const messageEnums = new Enum({ 'chat': 1, 'group': 2 });
const accountTypeEnums = new Enum({ 'individual': 1, 'corporate': 2 });

exports.getPaymentMethodEnums = () => {
    return paymentMethodEnums;
};

exports.getPaymentStatusEnums = () => {
    return paymentStatusEnums;
};

exports.getUserEnum = () => {
    return userTypeEnums;
};

exports.getStatusEnum = () => {
    return statusEnums;
};

exports.getOtpEnum = () => {
    return otpEnums;
};

exports.getProductEntryEnums = () => {
    return productEntryEnums;
}

exports.getProductTypeEnums = () => {
    return productTypeEnums;
}

exports.getGenderEnums = () => {
    return genderEnums;
}

exports.getKycEnums = () => {
    return kycEnums;
}

exports.getPaymentGatewayEnums = () => {
    return paymentGatewayEnums;
}

exports.getStatisticEnums = () => {
    return statisticEnums;
}
exports.getMessageEnums = () => {
    return messageEnums;
}
exports.getAccountTypeEnums = () => {
    return accountTypeEnums;
}
