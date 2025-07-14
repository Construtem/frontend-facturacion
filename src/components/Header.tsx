// src/components/Header.tsx
"use client";

import { forwardRef, useEffect, useState } from 'react';
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import { useParams } from "next/navigation";
import { getQuotePreview } from '../app/services/QuotePreviewService';




export default forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  function Header(props, ref) {
  const { id: quoteId } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
        const [responseError, setResponseError] = useState<string | null>(null);

        const [cotizacion, setCotizacion] = useState({
            id: "N/A",
            fecha_emision: "N/A",
            subtotal: 0,
            impuesto: 0,
            total: 0,
            usuario:  { email: '', nombre: '' },
        });
  useEffect(() => {
              getQuotePreview(Number(quoteId))
              .then((response) => {
                  // Axios devuelve los datos en `response.data`
                  setCotizacion(response.data);
                  setIsLoading(false);
              })
              .catch((error) => {
                console.error("Error al obtener la cotización:", error);
              
                setIsLoading(false);
              });
          }, [quoteId]);  
  return (
      <header ref={ref} style={styles.header}>
        <div style={styles.left}>
          <div style={styles.logoContainer}>
            <Image
              src={logo}
              alt="ConstrUTEM Logo"
              style={styles.logoImg}
            />
          </div>
        </div>

        <div style={styles.right}>
          <span style={styles.userInfo}>
            <span style={styles.userIcon}>👤</span>
            <span style={styles.userText}>
              <span style={styles.userName}>{cotizacion.usuario.nombre}</span>
              <span style={styles.userEmail}>{cotizacion.usuario.email}</span>
            </span>
          </span>
        </div>
      </header>
    );
    
  }
);


const styles: { [key: string]: React.CSSProperties } = {
  header: {
    width: '100%',
    height: '58px',
    background: '#1f282f',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    boxSizing: 'border-box',
    position: 'fixed',
    top: '0',
    left: '0',
    zIndex: '100',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  },
  logoContainer: {
    padding: '3px 0',
    height: '100%',
    boxSizing: 'border-box',
    width: 'auto',
  },
  logoImg: {
    height: '100%',
    width: 'auto',
    objectFit: 'contain',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '4px 16px',
  },
  userRole: {
    backgroundColor: '#ff8000',
    borderRadius: '20px',
    padding: '8px 15px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
    color: '#222222',
    fontWeight: 'medium',
    fontFamily: 'Roboto, sans-serif',
    fontSize: '15px',
    whiteSpace: 'nowrap',
    userSelect: 'none',
  },
  userIcon: {
    background: 'white',
    color: '#1f2937',
    borderRadius: '50%',
    padding: '4px',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
  },
  userText: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: '19px',
  },
  userName: {
    fontSize: '16px',
    color: 'white',
  },
  userEmail: {
    fontSize: '13px',
    color: '#a5b4fc',
  },
};