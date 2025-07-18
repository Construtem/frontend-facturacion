import api from './api';

export const getDespachoPdf = async (id: number) => {
  const response = await api.get(`/api/despacho-pdf/${id}`, {
    responseType: 'arraybuffer',
  });
  return response;
};
