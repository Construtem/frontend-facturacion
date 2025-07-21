'use client';

import React, { useState, useEffect } from 'react';
import formatNumberWithSpaces from "./utilities/FormatNumberWithDots";
import Link from 'next/link';
import { parseShortDate } from "./utilities/ParseDate";
import { getFacturaPdf } from '@/app/services/FacturaPdf';
import {
  OrangeBoxStyled,
  OrangeBoxItemStyled,
  FooterBoxStyled,
  ButtonContainerStyled
} from './styled-components/summaryTab.styles';
import { getPaymentData } from '@/app/services/Summary-call';

interface AmountDetails {
  fecha_emision: string,
  subtotal: number,
  impuesto: number,
  total: number,
}

interface CotizacionData {
  numero_factura: number;
  nombre_cliente: string;
  empresa: string;
  rut_cliente: string;
}

export default function SummaryTab({status, previewQuoteId, isPagado, amountDetails}: {
  status: string | undefined,
  previewQuoteId: string | undefined,
  isPagado: boolean | undefined,
  amountDetails: AmountDetails | undefined
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [facturaPdf, setFacturaPdf] = useState<string | null>(null);
  const [cotizacionData, setCotizacionData] = useState<CotizacionData | null>(null);
  const ventasUrl = process.env.NEXT_PUBLIC_VENTAS_URL || "https://ventas.tssw.cl/";

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Obtener datos de cotización del backend
  useEffect(() => {
    if (previewQuoteId !== undefined && (status === 'approved' || isPagado)) {
      getPaymentData(Number(previewQuoteId))
        .then((response) => {
          setCotizacionData(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener los datos de la cotización:", error);
        });
      }
  }, [previewQuoteId, status, isPagado]);

  // Obtener PDF solo cuando se abre el modal
  useEffect(() => {
    if (previewQuoteId !== undefined && (status === 'approved' || isPagado)) {
      if (facturaPdf === null) {
        getFacturaPdf(Number(previewQuoteId))
        .then((response) => {
          const pdfBytes = new Uint8Array(response.data);
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          setFacturaPdf(url);

          // Limpieza
          return () => URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error("Error al obtener la factura:", error);
        });
      } else { setPdfUrl(facturaPdf) }
    }
  }, [isModalOpen, facturaPdf, previewQuoteId, isPagado, status]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Resumen de Compra</h1>

      <OrangeBoxStyled>
        <OrangeBoxItemStyled>
          N° Factura: {cotizacionData ? cotizacionData.numero_factura : "Cargando..."}
        </OrangeBoxItemStyled>
        <OrangeBoxItemStyled>
          Fecha de Emision: {amountDetails ? parseShortDate(amountDetails.fecha_emision) : "Error al cargar"}
        </OrangeBoxItemStyled>
        <OrangeBoxItemStyled>
          Cliente: {cotizacionData ? cotizacionData.nombre_cliente : "Cargando..."}
        </OrangeBoxItemStyled>
        <OrangeBoxItemStyled>
          Rut cliente: {cotizacionData ? cotizacionData.rut_cliente : "Cargando..."}
        </OrangeBoxItemStyled>
        <OrangeBoxItemStyled>
          Empresa: {cotizacionData ? cotizacionData.empresa : "Cargando..."}
        </OrangeBoxItemStyled>
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
        <div style={styles.footerItem}>{cotizacionData ? cotizacionData.numero_factura : ""}</div>
      </FooterBoxStyled>
      <ButtonContainerStyled>
        <button style={styles.button} onClick={openModal}>
          Ver Factura
        </button>
        <Link href={ventasUrl} style={styles.button}>
          Siguiente
        </Link>
      </ButtonContainerStyled>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <button style={{ ...styles.closeButton, border: 'none', padding: '0px', fontSize: '32px' }} onClick={closeModal}>
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
              <ButtonContainerStyled>
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
              </ButtonContainerStyled>
              <ButtonContainerStyled>
                <button style={styles.closeButton} onClick={closeModal}>
                  Salir
                </button>
              </ButtonContainerStyled>
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
    backgroundColor: '#2563B6',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
    textDecoration: 'none',
    cursor: 'pointer',
    alignContent: 'center',
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
    backgroundColor: '#0B1631',
    padding: '20px',
    margin: '6px',
    maxWidth: '800px',
    width: '90%',
    height: '90%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    borderRadius: '16px',
  },
  iframe: {
    flexGrow: 1,
    border: '4px solid white',
    borderRadius: '8px',
    width: '100%',
    boxSizing: 'border-box',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'right',
    alignItems: 'center',
    marginBottom: '10px',
  },
  closeButton: {
    padding: '12px 24px',
    border: '1px solid white',
    backgroundColor: '#0B1631',
    borderRadius: '8px',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '10px',
  },
};