import api from './api';

export const getPaymentData = async (id: number) => {
    const response = await api.get(`/api/Sumary-data/${id}`);
    console.log('Response from backend:', response.data);
    return response;
};