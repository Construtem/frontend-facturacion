import api from './api';

export const getFacturaPdf = async (id: number) => {
    const response = await api.get(`/api/factura-pdf/${id}`);
    return response;
};