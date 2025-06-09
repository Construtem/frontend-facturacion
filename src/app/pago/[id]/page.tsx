"use client";

import { useState, FormEvent, useEffect } from "react";
import Image from "next/image";
import mplogo from "@/styles/images/logo-mercado-pago.png";
import Header from "@/components/admin/header";
import { paymentFormValidation } from "./paymentFormValidation";
import Link from "next/link";
import { useParams, useRouter } from 'next/navigation';
import './styles.css'

declare global {
  interface Window {
    MercadoPago: any;
  }
}

const FormularioMP = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [errorMsg, setErrorMsg] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fieldIds = [
    "form-checkout__cardNumber",
    "form-checkout__expirationDate",
    "form-checkout__securityCode",
    "form-checkout__cardholderName",
    "form-checkout__cardholderEmail",
    "form-checkout__identificationNumber",
  ];
  const { fieldValidity, isFormValid } = paymentFormValidation(fieldIds);

  function getInputStyle(fieldId: string) {
    return fieldValidity[fieldId] === false ? styles.inputError : styles.input;
  }

  function showLoadingOverlay() {
    setShowOverlay(true);
    setIsLoading(true);
  }

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.onload = () => {
      const mp = new window.MercadoPago(process.env.TOKEN_MERCADOPAGO, {
        locale: 'es-CL',
      });

      const cardForm = mp.cardForm({
        amount: '100',
        autoMount: true,
        form: {
          id: "form-checkout",
          cardNumber: {
            id: "form-checkout__cardNumber",
            placeholder: "1234 5678 9100 1121",
          },
          expirationDate: {
            id: "form-checkout__expirationDate",
            placeholder: "01/33",
          },
          securityCode: {
            id: "form-checkout__securityCode",
            type: "password",
            placeholder: "XYZ",
          },
          cardholderName: {
            id: "form-checkout__cardholderName",
            placeholder: "Titular de la tarjeta",
          },
          cardholderEmail: {
            id: "form-checkout__cardholderEmail",
            placeholder: "correo@ejemplo.com",
          },
          identificationType: {
            id: "form-checkout__identificationType",
            placeholder: "",
          },
          identificationNumber: {
            id: "form-checkout__identificationNumber",
            placeholder: "XXXXXXXX-X",
          },
          issuer: {
            id: "form-checkout__issuer",
            placeholder: "",
          },
          installments: {
          id: "form-checkout__installments",
          placeholder: "",
          },
        },
        callbacks: {
          onFormMounted: (error: Error | null) => {
            if (error) return console.warn('Error en el formulario:', error);
          },
          onSubmit: async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            const {
              amount,
              paymentMethodId,
              token,
              cardholderEmail,
            } = cardForm.getCardFormData();

            showLoadingOverlay();
            try {
              const response = await fetch('/api/pago', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  transaction_amount: 100,
                  payment_method_id: paymentMethodId,
                  card_token: token,
                  email: cardholderEmail,
                }),
              });

              const result = await response.json();

              if (!response.ok || result.status !== 'approved') {
                router.replace(`/pago/${id}/resultado?status=rejected&message=Tarjeta%20rechazada%20por%20el%20servidor.`);
              } else {
                router.replace(`/pago/${id}/resultado?status=approved`);
              }
            } catch (error) {
              console.error('Error en el pago:', error);
              router.replace(`/pago/${id}/resultado?status=rejected&message=${error}`);
            }
          },
        },
      });
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div style={styles.pageBackground}>
      { <Header onToggleSidebar={() => {}} /> }
      <div style={styles.paymentWrapper}>
        <div style={styles.paymentBox}>
          <form id="form-checkout" style={styles.form}>
            <Image
              src={mplogo}
              alt="Mercado Pago logo"
              style={styles.logoImg as React.CSSProperties}
              draggable={false}
            />
            <div style={{ width: '400px' }}>
              <h2 style={styles.title}>Pago con tu tarjeta</h2>
              <p
                style={{
                  fontSize: "16px",
                  textAlign: "left",
                  color: "#444",
                  marginBottom: "10px",
                }}
              > Ingresa los datos de tu tarjeta para procesar tu compra
                de forma segura.
              </p>
              <h2
                style={{
                  ...styles.title,
                  fontSize: "24px",
                  marginBottom: "10px"
                }}
              > Datos de la tarjeta:
              </h2>
              <label style={styles.subtitle}>
                Número de tarjeta
                <input
                  id="form-checkout__cardNumber"
                  style={getInputStyle("form-checkout__cardNumber")}
                />
                {fieldValidity["form-checkout__cardNumber"] === false && (
                  <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                    El número de tarjeta debe tener 16 dígitos separados por espacios.
                  </p>
                )}
              </label>
              <label style={styles.subtitle}>
                Fecha de vencimiento
                <input
                  id="form-checkout__expirationDate"
                  style={getInputStyle("form-checkout__expirationDate")}
                />
                {fieldValidity["form-checkout__expirationDate"] === false && (
                  <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                    La fecha debe estar en formato MM/AA y ser válida.
                  </p>
                )}
              </label>
              <label style={styles.subtitle}>
                Código de seguridad (CVV)
                <input
                  id="form-checkout__securityCode"
                  style={getInputStyle("form-checkout__securityCode")}
                />
                {fieldValidity["form-checkout__securityCode"] === false && (
                  <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                    El código de seguridad debe tener 3 dígitos.
                  </p>
                )}
              </label>
              <label style={styles.subtitle}>
                Nombre del titular
                <input
                  id="form-checkout__cardholderName"
                  style={getInputStyle("form-checkout__cardholderName")}
                />
                {fieldValidity["form-checkout__cardholderName"] === false && (
                  <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                    El nombre del titular no puede estar vacío.
                  </p>
                )}
              </label>
              <h2
                style={{
                  ...styles.title,
                  fontSize: "24px",
                  marginBottom: "10px"
                }}
              > Datos del titular:
              </h2>
              <label style={styles.subtitle}>
                Correo electrónico
                <input
                  id="form-checkout__cardholderEmail"
                  style={getInputStyle("form-checkout__cardholderEmail")}
                />
                {fieldValidity["form-checkout__cardholderEmail"] === false && (
                  <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                    El correo electrónico debe ser válido.
                  </p>
                )}
              </label>
              <label style={{ ...styles.subtitle}}>
                Tipo de documento {/* Deshabilitado para pruebas */}
                <select
                  id="form-checkout__identificationType"
                  style={getInputStyle("form-checkout__identificationType")}
                ></select>
                {fieldValidity["form-checkout__identificationType"] === false && (
                  <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                    Seleccione un tipo de documento válido.
                  </p>
                )}
              </label>
              <label style={styles.subtitle}>
                Número de documento (RUT)
                <input
                  id="form-checkout__identificationNumber"
                  style={getInputStyle("form-checkout__identificationNumber")}
                />
                {fieldValidity["form-checkout__identificationNumber"] === false && (
                  <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                    El número de documento sin puntos y con guión.
                  </p>
                )}
              </label>
              <h2
                style={{
                  ...styles.title,
                  fontSize: "24px",
                  marginBottom: "10px"
                }}
              > Datos bancarios:
              </h2>
              <label style={styles.subtitle}>
                Banco emisor
                <select
                  id="form-checkout__issuer"
                  style={getInputStyle("form-checkout__issuer")}
                ></select>
                {fieldValidity["form-checkout__issuer"] === false && (
                  <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                    Seleccione un banco emisor válido.
                  </p>
                )}
              </label>
              <select id="form-checkout__installments" style={{ display: 'none' }}></select>
            </div>
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              style={{
                ...styles.button,
                backgroundColor: isFormValid ? "#ff8000" : "#999",
                cursor: isFormValid ? "pointer" : "no-cursor",
              }}
            > { isLoading ? "Procesando tu pago..." : "Pagar" }
            </button>
            <Link
              href={`/cotizacion/${id}`}
              type="button"
              style={{
                ...styles.button,
                backgroundColor: "#555",
              }}
              > Cambiar cotización
            </Link>
            <div style={{ paddingBottom: '40px' }}></div>
          </form>
        </div>
        {showOverlay && (
        <div style={styles.overlay}>
          <p style={styles.title}>Procesando tu pago...</p>
          <div style={styles.spinner}></div>
          <p style={styles.subtitle}>Por favor, no salgas ni recargues la página.</p>
        </div>
      )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  pageBackground: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: "100vw",
    background: "#F2F2F2",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
    paddingTop: "58px",
  },
  paymentWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
    maxHeight: 'calc(90vh - 58px)',
    borderRadius: '10px',
  },
  paymentBox: {
    display: 'flex',
    flexDirection: 'row',
    padding: '40px',
    overflowY: 'auto',
    width: '800px',
    backgroundColor: '#ffffff',
  },
  logoImg: {
    height: 'auto',
    maxHeight: '58px',
    objectFit: 'contain',
    width: 'auto',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'left',
    color: '#222',
    fontFamily: '"Montserrat", sans-serif',
  },
  subtitle: {
    fontSize: '18px',
    fontWeight: 'normal',
    marginBottom: '10px',
    marginTop: '10px',
    textAlign: 'left',
    color: '#555',
    fontFamily: '"Roboto", sans-serif',
  },
  form: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
  },
  input: {
    padding: '10px',
    marginBottom: '15px',
    fontSize: '16px',
    border: '1px solid #999',
    borderRadius: '5px',
    width: '100%',
  },
  inputError: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #E53935',
    color: '#E53935',
    borderRadius: '5px',
    width: '100%',
  },
  button: {
    marginTop: '15px',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: 'none',
    background: '#00A859',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: '"Montserrat", sans-serif',
    display: 'inline-block',
    textAlign: 'center',
    textDecoration: 'none',
  },
  overlay: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    zIndex: '10',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'slideDown 0.6s ease forwards'
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

export default FormularioMP;
