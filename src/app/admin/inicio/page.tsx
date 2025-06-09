"use client";

import { useEffect, useState } from "react";
import Link from 'next/link'; // para navegacion por Next.js
import {getinventario} from '../../lib/services/inventario';

// Pantalla para realizar el pago
export default function PagoPage() {
  const [cotizacion, setCotizacion] = useState<any>({
    id: "N/A",
    fecha_emision: "N/A",
    subtotal: 0,
    impuesto: 0,
    total: 0,
  });




//Dentro de él, se usa fetch() para hacer una petición HTTP al backend que tú hiciste en Go.
//  La URL es: http://localhost:8080/api/cotizacion/1

  useEffect(() => {
    // Simulación de llamada a la API
    fetch(getinventario(1)) // Cambia el ID según sea necesario
      .then((response) => response.json())
      .then((data) => setCotizacion(data))
      .catch((error) => console.error("Error al obtener la cotización:", error));
  }, []);

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Detalles de pago</h1>
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
          <a href="https://www.wikipedia.org" style={buttonStyle} target="_blank" rel="no poner no referrer">
            Atrás
          </a>
          
          <Link href="/admin/inicio/test" style={buttonStyle}>
            Pagar por mercado pago
          </Link>
          
          
        </div>
      </div>
      <div style={logoContainerStyle}>
        <img src="/logo.png" alt="Logo de la empresa" style={logoStyle} />
      </div>
    </div>
  );
}

// --- CSS en JS ---
const containerStyle: React.CSSProperties = {
  display: "flex",
  marginLeft: "180px", // ancho del sidebar
  marginTop: "70px",   // alto del header
  padding: "2rem",
  boxSizing: "border-box",
  minHeight: "calc(100vh - 70px)",
  backgroundColor: "#f9fafb", // Fondo más claro para mejor contraste
};

const cardStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: "white",
  borderRadius: "12px",
  padding: "2rem",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)", // Sombra más pronunciada
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
  gap: "1rem",
};

const buttonStyle: React.CSSProperties = {
  padding: "0.75rem 1.5rem",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#2563eb",
  color: "white",
  fontWeight: "bold",
  textAlign: "center",
  textDecoration: "none",
  cursor: "pointer",
  transition: "transform 0.2s, background-color 0.2s",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)", // Efecto 3D
};

const cashButtonStyle: React.CSSProperties = {
  padding: "0.75rem 1.5rem",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#10b981", // Color verde para diferenciar
  color: "white",
  fontWeight: "bold",
  textAlign: "center",
  textDecoration: "none",
  cursor: "pointer",
  transition: "transform 0.2s, background-color 0.2s",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)", // Efecto 3D
};

const logoContainerStyle: React.CSSProperties = {
  marginLeft: "2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const logoStyle: React.CSSProperties = {
  width: "300px",
  height: "auto",
  marginTop: "2rem",
};