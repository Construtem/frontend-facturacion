/*
2. Dentro de ese archivo, escribe funciones que usen axios para pedir datos al backend. Por ejemplo:
   - Una función para obtener una cotización.
   - Más adelante puedes agregar funciones para crear, actualizar o borrar cotizaciones.

Así, cada vez que tu aplicación necesite datos de cotización, solo llamas a estas funciones desde cualquier componente.


 */


import axios from 'axios';

export const getQuotePreview = async (id: number) => {
  const response = await axios.get(`/api/quote-preview/${id}`);
  return response.data;
};

// Puedes agregar más funciones (POST, PUT, DELETE) según lo necesites
