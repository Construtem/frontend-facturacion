import { AxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import api from '../../../services/api';

export const POST = async (req: NextRequest, { params }: { params: Promise<{ id: number }> }) => {
  try {
    const { id } = await params;
    const body = await req.json();
    
    const res = await api.post(`${process.env.DEV_BACKEND_URL}api/despacho/${id}`, body);

    return NextResponse.json(res.data, { status: res.status });
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      const status = err.response?.status || 500;
      const message = err.response?.data || { error: ['Error inesperado al enviar despacho'] };
      return NextResponse.json(message, { status });
    }

    return NextResponse.json(
      { error: ['Error inesperado al enviar despacho'] },
      { status: 500 }
    );
  }
};

// Type guard para AxiosError
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true;
}