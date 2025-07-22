// src/components/QuotePreviewTab.tsx
'use client'

import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { getQuotePreview } from '../app/services/QuotePreviewService';
import { parseLargeDate } from "./utilities/ParseDate";
import formatNumberWithSpaces from "./utilities/FormatNumberWithDots";

interface AmountDetails {
  fecha_emision: string,
  subtotal: number,
  impuesto: number,
  total: number,
}

export interface QuotePreviewHandle {
  saveQuote: () => void;
  getPreviewQuoteId: () => string;
  getAmountDetails: () => AmountDetails;
  getIsPagado: () => string;
  getAmount: () => number;
}

interface QuotePreviewTabProps extends React.HTMLProps<HTMLDivElement> {
  onUpdateStep: (step: number) => void;
  quoteId: number;
}

export default forwardRef<QuotePreviewHandle, QuotePreviewTabProps>(
    function QuotePreviewTab(props, ref) {
        const { onUpdateStep, quoteId } = props;
        const [isPagado, setIsPagado] = useState<string>('nuevo');

        const translateError = (error: string | number): string => {
          if (Number(error) === 404) {
            return "La cotización no existe o no ha sido encontrada.";
          }
          return "Ha ocurrido un error inesperado.";
        };

        const [isLoading, setIsLoading] = useState<boolean>(true);
        const [responseError, setResponseError] = useState<string | null>(null);

        const [cotizacion, setCotizacion] = useState({
            id: "N/A",
            fecha_emision: "N/A",
            subtotal: 0,
            impuesto: 0,
            total: 0,
            cotizacion_id: 0,
            pagado: "N/A",
        });
        useEffect(() => {
            getQuotePreview(Number(quoteId))
            .then((response) => {
                // Axios devuelve los datos en `response.data`
                setCotizacion(response.data);
                setIsLoading(false);
                const pagoStatus = response.data.pagado;
                if (pagoStatus === 'nuevo' || pagoStatus === 'pending') {
                  setIsPagado('nuevo');
                } else if (pagoStatus === 'en proceso') {
                  setIsPagado('en proceso');
                  onUpdateStep(3);
                } else if (pagoStatus === 'rejected' ) {
                  setIsPagado('tryagain');
                  onUpdateStep(3);
                } else if (pagoStatus === 'approved') {
                  setIsPagado('approved');
                  onUpdateStep(4);
                }
            })
            .catch((error) => {
              setResponseError(translateError(error.response.status));
              setIsLoading(false);
            });
        }, [quoteId, onUpdateStep]);

        useImperativeHandle(ref, () => ({
            saveQuote: async () => {
                // const result = await QuotePreviewService.create({ /*…*/ });
                // otras cosas utiles en caso de ser necesario
            },
            getPreviewQuoteId: () => {
              return cotizacion.id;
            },
            getAmountDetails: () => {
              const amountDetails = {
                fecha_emision: cotizacion.fecha_emision,
                subtotal: cotizacion.subtotal,
                impuesto: cotizacion.impuesto,
                total: cotizacion.total
              };
              return amountDetails;
            },
            getIsPagado: () => {
              return isPagado;
            },
            getAmount: () => {
              return cotizacion.total;
            }
        }));

        return (
            <div>
                <h1 style={styles.title}>Detalles de pago</h1>
                <hr style={styles.line} />

                <p style={styles.description}>
                    A continuación, encontrarás los detalles de tu cotización.
                    Por favor, verifica que toda la información
                    sea correcta antes de proceder con el pago.
                </p>

                <div style={styles.details}>
                {
                  // Esperando respuesta a la petición
                  isLoading ?
                  <div style={styles.spinnerContainer} >
                    <div style={styles.spinner} />
                  </div>
                  // Por si la petición retorna un error
                  : responseError !== null ?
                  <div>
                    <p style={styles.detailText}>
                      Lo sentimos, ha ocurrido un error al tratar de cargar
                      su cotización. Por favor intentelo denuevo.
                    </p>
                    <p style={styles.detailtext}>
                      <strong>Error: </strong> {responseError}
                    </p>
                  </div>
                  // Contenido de la cotización cuando la petición es exitosa
                  :
                  <div>
                    <p style={styles.detailText}>
                        <strong>ID de Cotización: </strong>
                        <span style={styles.placeholderStyle}>
                          {cotizacion.cotizacion_id}
                        </span>
                    </p>
                    <p style={styles.detailText}>
                        <strong>Fecha de Emisión: </strong>
                        <span style={styles.placeholderStyle}>
                          {parseLargeDate(cotizacion.fecha_emision)}
                        </span>
                    </p>
                    <p style={styles.detailText}>
                        <strong>Subtotal (desc. aplicado): </strong>
                        <span style={styles.placeholderStyle}>
                          ${formatNumberWithSpaces(cotizacion.subtotal)}
                        </span>
                        <span style={{ fontStyle: 'italic', fontSize: '14px' }}> *Incluye envío</span>
                    </p>
                    <p style={styles.detailText}>
                        <strong>Impuesto: </strong>
                        <span style={styles.placeholderStyle}>
                          ${formatNumberWithSpaces(cotizacion.impuesto)}
                        </span>
                    </p>
                    <p style={styles.detailText}>
                        <strong>Total: </strong>
                        <span style={styles.placeholderStyle}>
                          ${formatNumberWithSpaces(cotizacion.total)}
                        </span>
                    </p>
                  </div>
                }
                </div>

                <div style={styles.buttonContainer}>
                    <button
                      type="button"
                      disabled={isLoading || responseError !== null}
                      style={{
                        ...styles.button,
                        backgroundColor: !isLoading && responseError === null ? "#FF7300" : "#999",
                        cursor: !isLoading && responseError === null ? "pointer" : "no-cursor",
                      }} 
                      onClick={() => onUpdateStep(2)}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        );
    }
);

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
  line: {
    border: 'none',
    height: '4px',
    width: '100%',
    backgroundColor: '#FF7300',
    margin: '16px 0px',
  },
  description: {
    fontFamily: '"Roboto", sans-serif',
    fontSize: '16px',
    color: '#2D2D2D',
    marginBottom: '32px',
    textAlign: 'left',
  },
  details: {
    marginBottom: '32px',
    padding: '16px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: '#f9fafb',
  },
  detailText: {
    color: '#2D2D2D1',
    lineHeight: '1.8',
    marginBottom: '12px',
    fontSize: '16px',
  },
  placeholder: {
    fontWeight: 'bold',
    color: '#2563eb',
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
    transition: 'transform 0.2s, background-color 0.2s',
  },
  spinnerContainer: {
    width: '100%',
    height: '100%',
    justifyItems: 'center',
  },
  spinner: {
    border: '6px solid #f3f3f3',
    borderTop: '6px solid #ff8000',
    borderRadius: '50%',
    width: '100px',
    height: '100px',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
};