import axios from 'axios';

export const getinventario = async (id: number) => {
    const response = await axios.get(`/api/inventario/${id}/`);
    return response;
  };