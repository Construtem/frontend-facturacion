import api from './api';

// eslint-disable-next-line
export const enviarDespacho = async (id: number, data: any) => {
  const response = await api.post(`/api/despacho/${id}`, data);
  return response;
};