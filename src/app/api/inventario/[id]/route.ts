// crear el link del endpoint donde se enlazaria a l backend

// crear el post 


import { NextRequest, NextResponse } from 'next/server';
import api from '../../../lib/services/api';

const GET = async (request: NextRequest, { params }: { params: Promise<{ id: number }> }) => {
  try {
    const { id } = await params;
    const res = await api.get(`/api/cotizacion/${id}/`); // modificar esto al url real del diego
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    console.error('Error getting scheduled transaction:', error);
    return NextResponse.json(
      { error: ['Error al obtener la inventario programada'] },
      { status: 500 }
    );
  }
};

export { GET };








// Crear el lost service 


