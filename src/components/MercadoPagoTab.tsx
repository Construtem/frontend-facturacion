// src/components/MercadoPagoTab.tsx
'use client'

import { useEffect, useState, forwardRef, useImperativeHandle, FormEvent  } from "react";
import { postPayment_MercadoPago } from "@/app/services/Payment_MercadoPago";
import { useFormValidator } from "./utilities/FormValidator";
import { mpvalidators, validateRutChileno } from "./utilities/Validators";
import Image from "next/image";
import mplogo from "@/assets/images/logo-mercado-pago.png";
import { getCardType } from "./utilities/getCardType";



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
        const { fieldValidity: validatorFieldValidity, isFormValid: validatorIsFormValid } = useFormValidator(fieldIds, mpvalidators, formKey);
    
        // Estado para la validez de los campos, para poder actualizar manualmente el RUT
        const [fieldValidity, setFieldValidity] = useState<{ [key: string]: boolean | null }>({});
        const [isFormValid, setIsFormValid] = useState(false);
        // Hook de validación, sincroniza con el estado local
        const validatorResult = useFormValidator(fieldIds, mpvalidators, formKey);
        useEffect(() => {
            setFieldValidity(validatorResult.fieldValidity);
            setIsFormValid(validatorResult.isFormValid);
        }, [validatorResult.fieldValidity, validatorResult.isFormValid]);
    
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
                            placeholder: "1234 5678 9012 3456",
                        },
                        expirationDate: {
                            id: "form-checkout__expirationDate",
                            placeholder: "01/33",
                        },
                        securityCode: {
                            id: "form-checkout__securityCode",
                            placeholder: "123",
                        },
                        cardholderName: {
                            id: "form-checkout__cardholderName",
                            placeholder: "NOMBRE APELLIDO",
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
                            placeholder: "12345678K",
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

        // Estado para mostrar error si se ingresan letras en el número de tarjeta
        const [cardNumberError, setCardNumberError] = useState<string>("");
        const [cvvError, setCvvError] = useState<string>("");
        // Estado para el tipo de documento, se usa para el RUT chileno
        const [documentType, setDocumentType] = useState<string>("RUT");
        // Estado para el mensaje de validación del RUT
        const [rutValidationMsg, setRutValidationMsg] = useState<string>("");
        // Estado para el tipo de tarjeta y su icono
        const [cardType, setCardType] = useState<any>(null);
       
        // Formatea el número de tarjeta con espacios automáticos cada 4 dígitos y muestra error si hay letras
        function handleCardNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
            if (/[^\d\s]/.test(e.target.value)) {
            setCardNumberError("Solo se permiten números en este campo");
            } else {
            setCardNumberError("");
            }
            let value = e.target.value.replace(/\D/g, ""); // Solo dígitos
            value = value.substring(0, 16); // Máximo 16 dígitos

            if (value.length === 15) {
            // Espacio cada 2 dígitos para tarjetas de 15 dígitos (ej. American Express)
            value = value.replace(/^(\d{4})(\d{6})(\d{5})$/, "$1 $2 $3");
            } else {
            // Espacio cada 4 dígitos para tarjetas de 16 dígitos
            value = value.replace(/(.{4})/g, "$1 ").trim();
            }

            const input = document.getElementById("form-checkout__cardNumber") as HTMLInputElement;
            if (input) input.value = value;
            // Detectar tipo de tarjeta y actualizar icono
            const detected = getCardType(value);
            setCardType(detected);
        }
        // Formatea el RUT chileno visualmente y guarda el valor limpio en data-raw
        // Muestra error si se ingresan caracteres distintos de números o k/K
        function handleRutChange(e: React.ChangeEvent<HTMLInputElement>) {
            let value = e.target.value.replace(/[^0-9kK]/g, '').toUpperCase();
            value = value.slice(0, 9); // Limita a 9 caracteres
            e.target.value = value;
            // Valida el RUT visualmente si el tipo de documento es RUT
            if (documentType === "RUT" && value.length >= 8) {
                if (validateRutChileno(value)) {
                    setRutValidationMsg("RUT válido");
                    setFieldValidity(prev => ({
                        ...prev,
                        ["form-checkout__identificationNumber"]: true
                    }));
                } else {
                    setRutValidationMsg("RUT inválido, verifique el digito verificador");
                    setFieldValidity(prev => ({
                        ...prev,
                        ["form-checkout__identificationNumber"]: false
                    }));
                }
            } else {
                setRutValidationMsg("");
                setFieldValidity(prev => ({
                    ...prev,
                    ["form-checkout__identificationNumber"]: null
                }));
            }
        }
        // Solo letras y espacios para nombre del titular
        function handleCardholderNameChange(e: React.ChangeEvent<HTMLInputElement>) {
            const value = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g, "");
            e.target.value = value;
        }
        // Solo números y máximo 4 caracteres para el CVV
        // Esta función se usa en el input del CVV para limitar la entrada y mostrar error si hay letras
        function handleCvvChange(e: React.ChangeEvent<HTMLInputElement>) {
            if (/[^\d]/.test(e.target.value)) {
                setCvvError("Solo se permiten números en este campo");
            } else {
                setCvvError("");
            }
            let value = e.target.value.replace(/\D/g, ''); // Solo dígitos
            value = value.slice(0, 4); // Máximo 4 caracteres
            e.target.value = value;
        }
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
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        id="form-checkout__cardNumber"
                                        style={getInputStyle("form-checkout__cardNumber")}
                                        onChange={handleCardNumberChange}
                                        placeholder="1234 5678 9012 3456"
                                    />
                                    {cardType && (
                                        <span style={{ marginLeft: 8, fontSize: 28 }}>
                                            <cardType.icon
                                                style={{
                                                    fontSize: 48,
                                                    color:
                                                        cardType.type === "Visa"
                                                            ? "#2563eb" // blue-600
                                                            : cardType.type === "Mastercard"
                                                            ? "#ef9a19" // red-600
                                                            : cardType.type === "American Express"
                                                            ? "#0891b2" // cyan-600
                                                            : cardType.type === "Coopeuch"
                                                            ? "#be185d" // pink-700
                                                            : cardType.type === "Scotiabank"
                                                            ? "#e11d48" // rose-600
                                                            : "#2d2d2d"
                                                }}
                                            />
                                        </span>
                                    )}
                                </div>
                                {cardNumberError && (
                                    <p style={{  fontSize: "12px", marginTop: "4px" }}>{cardNumberError}</p>
                                )}
                                {fieldValidity["form-checkout__cardNumber"] === false && (
                                <p style={{  fontSize: "12px", marginTop: "4px" }}>
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
                                    onChange={handleCvvChange} // Limita a 4 dígitos numéricos y muestra error si hay letras
                                />
                                {cvvError && (
                                    <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>{cvvError}</p>
                                )}
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
                                    onChange={handleCardholderNameChange}
                                    placeholder="NOMBRE APELLIDO"
                                />
                                {fieldValidity["form-checkout__cardholderName"] === false && (
                                <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                                    El nombre del titular no puede estar vacío y solo debe contener letras.
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
                                    onChange={e => setDocumentType(e.target.value)}
                                ></select>
                                {fieldValidity["form-checkout__identificationType"] === false && (
                                <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                                    Seleccione un tipo de documento válido.
                                </p>
                                )}
                            </label>
                            <label style={styles.description}>
                                {documentType && documentType !== "RUT" ? "Número de documento" : "Número de documento (RUT SIN puntos NI guion)"}
                                <input
                                    id="form-checkout__identificationNumber"
                                    style={getInputStyle("form-checkout__identificationNumber")}
                                    onChange={handleRutChange}
                                    placeholder="12.345.678-K"
                                />
                                {documentType === "RUT" && rutValidationMsg && (
                                    <p style={{ color: rutValidationMsg === "RUT válido" ? "green" : "red", fontSize: "12px", marginTop: "4px" }}>
                                        {rutValidationMsg}
                                    </p>
                                )}
                                {fieldValidity["form-checkout__identificationNumber"] === false && documentType === "RUT" && (
                                <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                                    El RUT ingresado no es válido. Verifique el dígito verificador.
                                </p>
                                )}
                                {fieldValidity["form-checkout__identificationNumber"] === false && documentType !== "RUT" && (
                                <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                                    El número de documento no puede ser vacío ni menor a 9 caracteres.
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