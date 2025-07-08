import { AxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import api from '../../../services/api';

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: number }> }) => {
  try {
    const { id } = await params;
    
    const res = await api.get(`${process.env.DEV_BACKEND_URL}api/pdf/factura/${id}`, { responseType: 'arraybuffer' });

    const pdfBuffer = res.data; // asegúrate que res.data es un Buffer o ArrayBuffer

    return new NextResponse(pdfBuffer, {
        status: res.status,
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename="factura.pdf"',
        },
    });
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      const status = err.response?.status || 500;
      const message = err.response?.data || { error: ['Error inesperado al obtener la cotizacion'] };
      return NextResponse.json(message, { status });
    }

    return NextResponse.json(
      { error: ['Error inesperado al obtener la cotizacion'] },
      { status: 500 }
    );
  }
};

// Type guard para AxiosError
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true;
}