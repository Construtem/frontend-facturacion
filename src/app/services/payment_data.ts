import api from './api';

export const getPaymentData = async (id: number) => {
    const response = await api.get(`http://localhost:8080/API/v1/post-pago/${id}`);
    return response;
};