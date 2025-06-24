import api from './api';

interface paymentData {
    amount: number,
    paymentMethodId: string,
    token: string,
    cardholderEmail: string,
    cotizacionId: number,
}

export const postPayment_MercadoPago = async (data: paymentData) => {
    const response = await api.post('/api/mercadopago', {
        transaction_amount: data.amount,
        payment_method_id: data.paymentMethodId,
        card_token: data.token,
        email: data.cardholderEmail,
        id: data.cotizacionId,
    });
    return response;
};