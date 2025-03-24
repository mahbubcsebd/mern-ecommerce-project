export const formatPrice = (price) => {
    return `৳ ${Intl.NumberFormat('bn-BD').format(price)}`;
};
