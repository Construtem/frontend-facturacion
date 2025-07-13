'use client';

import React, { useState, useEffect } from 'react';
import formatNumberWithSpaces from "./utilities/FormatNumberWithDots";
import { parseShortDate } from "./utilities/ParseDate";
import { getFacturaPdf } from '@/app/services/FacturaPdf';
import {
  OrangeBoxStyled,
  OrangeBoxItemStyled,
  FooterBoxStyled
} from './styled-components/summaryTab.styles';

interface AmountDetails {
  fecha_emision: string,
  subtotal: number,
  impuesto: number,
  total: number,
}

export default function SummaryTab({quoteId, amountDetails}: {quoteId: number | undefined, amountDetails: AmountDetails | undefined}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (isModalOpen && quoteId !== undefined && pdfUrl == null) {
      getFacturaPdf(Number(quoteId))
        .then((response) => {
          const pdfBytes = new Uint8Array(response.data);
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);

          // Limpieza
          return () => URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error("Error al obtener la factura:", error);
        });
    }
    }, [isModalOpen, pdfUrl]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Resumen de Compra</h1>

      <OrangeBoxStyled>
        <OrangeBoxItemStyled>N° Factura: 2899</OrangeBoxItemStyled>
        <OrangeBoxItemStyled>Fecha de Emision: { amountDetails != undefined ? parseShortDate(amountDetails.fecha_emision) : "Error al cargar"}</OrangeBoxItemStyled>
        <OrangeBoxItemStyled>Cliente: Cliente Ejemplo</OrangeBoxItemStyled>
        <OrangeBoxItemStyled>Rut cliente: 12.345.678-9</OrangeBoxItemStyled>
      </OrangeBoxStyled>

      <div style={styles.details}>
        <p style={styles.detailText}>
          <strong>Subtotal:</strong> ${ amountDetails != undefined ? formatNumberWithSpaces(amountDetails.subtotal) : "Error al cargar el subtotal"}
        </p>
        <p style={styles.detailText}>
          <strong>Impuesto:</strong> ${ amountDetails != undefined ? formatNumberWithSpaces(amountDetails.impuesto) : "Error al cargar el impuesto"}
        </p>
        <p style={styles.detailText}>
          <strong>Total:</strong> ${ amountDetails != undefined ? formatNumberWithSpaces(amountDetails.total) : "Error al cargar el total"}
        </p>
      </div>

      <div style={styles.thanks}>Gracias por su compra</div>

      <FooterBoxStyled>
        <div style={styles.footerItem}>S.I.I. - Santiago</div>
        <div style={styles.footerItem}>2899</div>
      </FooterBoxStyled>

      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={openModal}>
          Ver Factura
        </button>
      </div>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <button style={styles.closeButton} onClick={closeModal}>
                ×
              </button>
            </div>
            { pdfUrl != null &&
              <embed
                src={pdfUrl || ""}
                type="application/pdf"
                style={styles.iframe}
              />
            }
            <div style={styles.modalFooter}>
              <div style={styles.buttonContainer}>
                <a
                  href={pdfUrl || ""}
                  download="Factura.pdf"
                  style={{
                    ...styles.button,
                    backgroundColor: pdfUrl != null ? "#FF7300" : "#999",
                    cursor: pdfUrl != null ? "pointer" : "no-cursor",
                  }}
                  aria-disabled={pdfUrl == null}
                >
                  { pdfUrl != null ? "Descargar PDF" : "Cargando PDF..." }
                </a>
              </div>
              <div style={styles.buttonContainer}>
                <button style={{ ...styles.button, backgroundColor: "#5C5C5C" }} onClick={closeModal}>
                  Salir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  title: {
    fontFamily: '"Montserrat", sans-serif',
    fontSize: '32px',
    fontWeight: 'bold',
    marginTop: '0px',
    marginBottom: '16px',
    color: '#222222',
    textAlign: 'left',
  },
  details: {
    marginBottom: '32px',
    padding: '16px',
    border: '1px solid #e5e7eb',
    borderRadius: '16px',
    backgroundColor: '#f9fafb',
  },
  detailText: {
    color: '#2D2D2D1',
    lineHeight: '1.8',
    marginBottom: '12px',
    fontSize: '16px',
  },
  thanks: {
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  footerItem: {
    display: 'flex',
    fontWeight: 'bold',
    height: '60px',
    boxSizing: 'border-box',
    alignItems: 'center',
  },
  button: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#FF7300',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  buttonContainer: {
    bottom: '0',
    left: '0',
    right: '0',
    display: 'flex',
    justifyContent: 'right',
    gap: '16px',
    marginTop: '16px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    margin: '6px',
    maxWidth: '800px',
    width: '90%',
    height: '90%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(255,115,0,0.12)',
  },
  iframe: {
    flexGrow: 1,
    border: 'none',
    width: '100%',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'right',
    alignItems: 'center',
    marginBottom: '10px',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5em',
    cursor: 'pointer',
    color: '#333',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '10px',
  },
};