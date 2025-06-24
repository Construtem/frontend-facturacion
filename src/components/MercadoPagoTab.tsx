// src/components/MercadoPagoTab.tsx
'use client'

import { useEffect, useState, forwardRef, useImperativeHandle, FormEvent  } from "react";
import { postPayment_MercadoPago } from "@/app/services/Payment_MercadoPago";
import { useFormValidator } from "./utilities/FormValidator";
import { mpvalidators } from "./utilities/Validators";
import Image from "next/image";
import mplogo from "@/assets/images/logo-mercado-pago.png";

export interface MercadoPagoHandle {
  getStatus: () => string;
  getMessage: () => string;
}

interface MercadoPagoProps extends React.HTMLProps<HTMLDivElement> {
  onUpdateStep: (step: number) => void;
  transaction_amount: number | undefined;
  cotizacion_id: number | string | undefined;
}

declare global {
  interface Window {
    MercadoPago: new (
        publicKey: string | undefined,
        options: { locale: string }
    ) => {
      cardForm: (options: Record<string, unknown>) => {
        getCardFormData: () => {
            amount: number;
            paymentMethodId: string;
            token: string;
            cardholderEmail: string;
        };
      };
    };
  }
}

export default forwardRef<MercadoPagoHandle, MercadoPagoProps>(
    function MercadoPagoTab(props, ref) {
        const { onUpdateStep, transaction_amount, cotizacion_id } = props;
        
        const [formKey, setFormKey] = useState<number>(0);
        const [status, setStatus] = useState<string>("");
        const [statusMessage, setStatusMessage] = useState<string>("");

        useImperativeHandle(ref, () => ({
            getStatus: () => {
                return status;
            },
            getMessage: () => {
                return statusMessage;
            },
        }));
    
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
        // Se le envia formKey para que se actualizen las referencias cada vez que
        // se desmonta y monta el formulario.
        const { fieldValidity, isFormValid } = useFormValidator(fieldIds, mpvalidators, formKey);
    
        function getInputStyle(fieldId: string) {
            return fieldValidity[fieldId] === false ? styles.inputError : styles.input;
        }
    
        function showLoadingOverlay(state: boolean) {
            setShowOverlay(state);
            setIsLoading(state);
        }
    
        useEffect(() => {
            // evita que cargue el script cuando no hay monto inicializado
            if (transaction_amount === undefined || transaction_amount === 0) return;

            // evita que cargue el script mas de una vez
            const existingScript = document.querySelector('script[src="https://sdk.mercadopago.com/js/v2"]');
            if (existingScript) {
                existingScript.remove();
            }

            const [integerAmount] = transaction_amount.toString().split('.');

            const script = document.createElement('script');
            script.src = 'https://sdk.mercadopago.com/js/v2';
            script.onload = () => {
                const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_TOKEN_MERCADOPAGO, {
                    locale: 'es-CL',
                });
        
                const cardForm = mp.cardForm({
                    amount: integerAmount,
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

                            const paymentData = {
                                amount: Number(amount),
                                paymentMethodId: paymentMethodId,
                                token: token,
                                cardholderEmail: cardholderEmail,
                                cotizacionId: Number(cotizacion_id),
                            }

                            showLoadingOverlay(true);
                            
                            postPayment_MercadoPago(paymentData)
                            .then((response) => {
                                setStatus(response.data.status); // "approved" o "rejected"
                                onUpdateStep(3);
                                showLoadingOverlay(false);
                                if (response.data.status === "rejected") {
                                    const error = response.data.detalle_status;
                                    setStatusMessage(error);
                                    setFormKey(formkey => formkey + 1); // obliga al form a remontarse
                                }
                            })
                            .catch((error) => {
                                setStatus("rejected"); // solo "rejected"
                                onUpdateStep(3);
                                showLoadingOverlay(false);
                                setStatusMessage(error.message);
                                setFormKey(formkey => formkey + 1); // obliga al form a remontarse
                                console.error("Error al procesar el pago:", error);
                            });
                        },
                    },
                });
            };
            document.body.appendChild(script);
        }, [transaction_amount, formKey, onUpdateStep]);

        return (
            <div style={styles.mpWrapper}>
                <form id="form-checkout" style={styles.form} key={formKey}>
                    <h2 style={styles.title}>Pago con tu tarjeta</h2>
                    <hr style={styles.line} />
                    <p style={styles.description}>
                        Ingresa los datos de tu tarjeta para
                        procesar tu compra de forma segura.
                    </p>
                    <div style={styles.doubleColumn}>
                        <div style={styles.formInputs}>
                            <h2
                                style={{
                                    ...styles.title,
                                    fontSize: "24px",
                                    marginBottom: "10px"
                                }}
                            > Datos de la tarjeta:
                            </h2>
                            <label style={styles.description}>
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
                            <label style={styles.description}>
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
                            <label style={styles.description}>
                                Código de seguridad (CVV)
                                <input
                                    id="form-checkout__securityCode"
                                    style={getInputStyle("form-checkout__securityCode")}
                                />
                                {fieldValidity["form-checkout__securityCode"] === false && (
                                <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                                    El código de seguridad debe tener 3 ó 4 dígitos.
                                </p>
                                )}
                            </label>
                            <label style={styles.description}>
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
                            <label style={styles.description}>
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
                            <label style={{ ...styles.description}}>
                                Tipo de documento
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
                            <label style={styles.description}>
                                Número de documento (RUT)
                                <input
                                    id="form-checkout__identificationNumber"
                                    style={getInputStyle("form-checkout__identificationNumber")}
                                />
                                {fieldValidity["form-checkout__identificationNumber"] === false && (
                                <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                                    El número de documento no puede ser vacío.
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
                            <label style={styles.description}>
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
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                            <Image
                                src={mplogo}
                                alt="Mercado Pago logo"
                                style={{ ...styles.logoImg, objectFit: 'contain' }}
                                draggable={false}
                            />
                        </div>
                    </div>
                    <div style={styles.buttonContainerMp}>
                        <button
                            type="button"
                            onClick={() => onUpdateStep(1)}
                            style={{
                                ...styles.buttonMp,
                                backgroundColor: "#5C5C5C",
                            }}
                        > Anterior
                        </button>
                        <button
                            type="submit"
                            disabled={!isFormValid || isLoading}
                            style={{
                                ...styles.buttonMp,
                                backgroundColor: isFormValid ? "#FF7300" : "#999",
                                cursor: isFormValid ? "pointer" : "no-cursor",
                            }}
                        > { isLoading ? "Procesando tu pago..." : "Pagar" }
                        </button>
                    </div>
                </form>
                {showOverlay && (
                    <div style={styles.overlay}>
                        <p style={styles.title}>Procesando tu pago...</p>
                        <div style={styles.spinner} />
                        <p style={styles.description}>Por favor, no salgas ni recargues la página.</p>
                    </div>
                )}
            </div>
        );
    }
);

const styles: { [key: string]: React.CSSProperties } = {
    mpWrapper: {
        position: 'relative',
    },
    title: {
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
    logoImg: {
        height: 'auto',
        maxHeight: '90px',
        objectFit: 'contain',
        width: 'auto',
    },
    form: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
    },
    doubleColumn: {
        display: 'flex',
        flexDirection: 'row',
        gap: '16px',
    },
    formInputs: {
        position: 'relative',
        width: '50%',
        marginBottom: '32px',
        padding: '16px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: '#f9fafb',
        boxSizing: 'border-box',
    },
    input: {
        padding: '10px',
        marginBottom: '15px',
        fontSize: '16px',
        border: '1px solid #999',
        borderRadius: '5px',
        minWidth: '50%',
        width: '100%',
        boxSizing: 'border-box',
    },
    inputError: {
        padding: '10px',
        fontSize: '16px',
        border: '1px solid #E53935',
        color: '#E53935',
        borderRadius: '5px',
        width: '100%',
        boxSizing: 'border-box',
    },
    buttonContainerMp: {
        bottom: '0',
        left: '0',
        right: '0',
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '16px',
    },
    buttonMp: {
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