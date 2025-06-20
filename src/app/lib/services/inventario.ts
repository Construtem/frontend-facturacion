import axios from 'axios';

export const getinventario = async (id: number) => {
    const response = await axios.get(`/api/quote-preview/${id}`);
    return response;
  };