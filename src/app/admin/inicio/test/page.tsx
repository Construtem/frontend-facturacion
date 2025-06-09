
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Esta es la página que muestra los detalles de la cotización y permite el pago
// a través de Mercado Pago. Se espera que el ID de la cotización se pase como parámetro de búsqueda en la URL.
//// Ejemplo de URL: /cotizacion?id=12345
// Esta página se renderiza en el lado del cliente (client-side) para poder manejar la navegación y los efectos secundarios.

export default function CotizacionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get("id");
  const [cotizacion, setCotizacion] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cotizacion/${id}`;

    fetch(apiUrl)
      .then((response) => {
        if (response.ok) return response.json();
        if (response.status === 400 || response.status === 404)
          throw new Error("Cotización no encontrada o ID inválido");
        throw new Error("Error inesperado al obtener la cotización");
      })
      .then((data) => setCotizacion(data))
      .catch((error) => setError(error.message));
  }, [id]);

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Error</h1>
          <p style={descriptionStyle}>{error}</p>
        </div>
      </div>
    );
  }

  if (!cotizacion) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Cargando cotización...</h1>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Detalles de la cotización</h1>
        <p style={descriptionStyle}>
          A continuación, encontrarás los detalles de tu cotización. Por favor, verifica que toda la información sea correcta antes de proceder con el pago.
        </p>
        <div style={detailsStyle}>
          <p style={detailTextStyle}>
            <strong>ID de Cotización:</strong> <span style={placeholderStyle}>{cotizacion.id}</span>
          </p>
          <p style={detailTextStyle}>
            <strong>Fecha de Emisión:</strong> <span style={placeholderStyle}>{cotizacion.fecha_emision}</span>
          </p>
          <p style={detailTextStyle}>
            <strong>Subtotal:</strong> <span style={placeholderStyle}>${cotizacion.subtotal}</span>
          </p>
          <p style={detailTextStyle}>
            <strong>Impuesto:</strong> <span style={placeholderStyle}>${cotizacion.impuesto}</span>
          </p>
          <p style={detailTextStyle}>
            <strong>Total:</strong> <span style={placeholderStyle}>${cotizacion.total}</span>
          </p>
        </div>
        <div style={buttonContainerStyle}>
          <button
            style={buttonStyle}
            onClick={() => {
              router.push(`/mercadopago?total=${cotizacion.total}`);
            }}
          >
            Pagar con Mercado Pago
          </button>
        </div>
      </div>
    </div>
  );
}

// --- CSS en JS ---
const containerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#f9fafb",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "white",
  borderRadius: "12px",
  padding: "2rem",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  maxWidth: "600px",
  width: "100%",
};

const titleStyle: React.CSSProperties = {
  fontSize: "2rem",
  fontWeight: "bold",
  marginBottom: "1rem",
  color: "#1f2937",
  textAlign: "center",
};

const descriptionStyle: React.CSSProperties = {
  fontSize: "1rem",
  color: "#4b5563",
  marginBottom: "2rem",
  textAlign: "center",
};

const detailsStyle: React.CSSProperties = {
  marginBottom: "2rem",
  padding: "1rem",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  backgroundColor: "#f9fafb",
};

const detailTextStyle: React.CSSProperties = {
  color: "#374151",
  lineHeight: "1.8",
  marginBottom: "0.75rem",
  fontSize: "1rem",
};

const placeholderStyle: React.CSSProperties = {
  fontWeight: "bold",
  color: "#2563eb",
};

const buttonContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
};

const buttonStyle: React.CSSProperties = {
  padding: "0.75rem 1.5rem",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#2563eb",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "transform 0.2s, background-color 0.2s",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
};