// crear el link del endpoint donde se enlazaria al backend 

// crear el post 


// Importamos los módulos necesarios desde 'next/server'.
// NextRequest: para manejar las solicitudes HTTP entrantes.
// NextResponse: para construir las respuestas HTTP.
import { NextRequest, NextResponse } from 'next/server';
// Importamos un cliente de API personalizado desde un archivo local.
// Este cliente probablemente maneja las solicitudes HTTP al backend.
import api from '../../../lib/services/api';



// Definimos una función asíncrona llamada GET que manejará solicitudes GET.
// Esta función recibe dos parámetros:
// 1. request: un objeto de tipo NextRequest que representa la solicitud HTTP.
// 2. params: un objeto que contiene parámetros dinámicos (en este caso, un ID).
const GET = async (request: NextRequest, { params }: { params: Promise<{ id: number }> }) => {
  try {
    // Extraemos el parámetro 'id' de los parámetros dinámicos.
    // Como 'params' es una Promesa, usamos 'await' para resolverla.
    const { id } = await params;
    
    // Realizamos una solicitud GET al backend usando el cliente de API.
    // La URL incluye el ID dinámico para obtener datos específicos.
    // Nota: La URL debe ser actualizada para reflejar el endpoint real del backend.
    const res = await api.get(`/api/cotizacion/${id}/`); // modificar esto al url real del diego
    // Si la solicitud al backend es exitosa, devolvemos una respuesta JSON
    // con los datos obtenidos y el estado HTTP correspondiente.
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    // Si ocurre un error durante la solicitud, lo registramos en la consola.
    console.error('Error getting scheduled transaction:', error);
    // Devolvemos una respuesta JSON con un mensaje de error y un estado HTTP 500.
    return NextResponse.json(
      { error: ['Error al obtener la inventario programada'] },
      { status: 500 }
    );
  }
};

// Exportamos la función GET para que pueda ser utilizada en otros archivos
// o como un controlador de ruta en Next.js.
export { GET };
// Comentario adicional: Aquí se menciona "Crear el lost service",
// lo que probablemente indica que falta implementar otro servicio o funcionalidad.


    
// Crear el lost service 