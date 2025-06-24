import api from './api';

export const getQuotePreview = async (id: number) => {
    const response = await api.get(`/api/quote-preview/${id}`);
    return response;
};