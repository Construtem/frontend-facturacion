import { AxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import api from '../../services/api';

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const res = await api.post('http://localhost:3050/API/v1/payment', body);

    return NextResponse.json(res.data, { status: res.status });
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      const status = err.response?.status || 500;
      const message = err.response?.data || { error: ['Error al procesar el pago'] };
      return NextResponse.json(message, { status });
    }

    return NextResponse.json(
      { error: ['Error inesperado al procesar el pago'] },
      { status: 500 }
    );
  }
};

// Type guard para AxiosError
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true;
}