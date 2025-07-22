// src/components/StatusTab.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import rechazadoimg from "@/assets/images/rechazado.png";
import aprobadoimg from "@/assets/images/aprobado.png";
import procesoimg from "@/assets/images/proceso.png";

export default function StatusTab({status, message, onUpdateStep}: {status: string | undefined, message: string | undefined, onUpdateStep: (step: number) => void}) {

    const errorMessages: { [key: string]: string } = {
        "cc_rejected_insufficient_amount": "Su tarjeta no tiene fondos suficientes para realizar el pago.",
        "cc_rejected_bad_filled_card_number": "El número de tarjeta ingresado es incorrecto. Verifique e intente nuevamente.",
        "cc_rejected_bad_filled_date": "La fecha de vencimiento es incorrecta. Revísela e intente otra vez.",
        "cc_rejected_bad_filled_other": "Algunos datos de su tarjeta son incorrectos. Verifíquelos e intente nuevamente.",
        "cc_rejected_bad_filled_security_code": "El código de seguridad es incorrecto. Por favor, revíselo.",
        "cc_rejected_blacklist": "No pudimos procesar el pago. Intente con otro medio de pago.",
        "cc_rejected_call_for_authorize": "Debe autorizar este pago con su banco. Llámelos y luego intente nuevamente.",
        "cc_rejected_card_disabled": "Su tarjeta está inactiva. Comuníquese con su banco para activarla.",
        "cc_rejected_card_error": "No pudimos procesar su pago. Intente nuevamente o con otra tarjeta.",
        "cc_rejected_duplicated_payment": "Ya se ha realizado un pago similar recientemente. Revise sus movimientos.",
        "cc_rejected_high_risk": "Rechazamos el pago por motivos de seguridad. Use otro medio de pago.",
        "cc_rejected_invalid_installments": "No puede pagar en esa cantidad de cuotas con esta tarjeta.",
        "cc_rejected_max_attempts": "Ha alcanzado el número máximo de intentos. Intente más tarde.",
        "cc_rejected_other_reason": "No pudimos procesar el pago. Intente con otro medio de pago.",
        "try_other_quote": "Su pago fue rechazado, por favor intentelo con otra cotización.",
    };

    const translateError = (error: string | undefined): string => {
        if (error) {
            return errorMessages[error] || "Ha ocurrido un error inesperado.";
        }
        return "Ha ocurrido un error inesperado";
    };

    const [currentStatus, setCurrentStatus] = useState<string | undefined>('');
    const ventasUrl = process.env.NEXT_PUBLIC_VENTAS_URL || "https://ventas.tssw.cl/";

    useEffect(() => {
      setCurrentStatus(status);
    }, [status])
    
    return (
        <div style={styles.statusBox}>
            { currentStatus === 'approved' &&
                <div>
                    <p style={{
                        ...styles.title,
                        textAlign: 'center',
                    }}>
                        ¡Pago aprobado!
                    </p>
                    <Image
                        src={aprobadoimg}
                        alt="aprobado"
                        style={styles.statusImg}
                        draggable={false}
                    />
                    <p style={{
                        ...styles.description,
                        textAlign: 'center',
                    }}>
                        Gracias por tu compra. El pago fue procesado correctamente.
                    </p>
                </div>
            }
            { currentStatus === 'in_process' &&
                <div>
                    <p style={{
                        ...styles.title,
                        textAlign: 'center',
                    }}>¡Pago en proceso!</p>
                    <Image
                        src={procesoimg}
                        alt="rechazado"
                        style={{ ...styles.statusImg, animation: 'spin 5s linear infinite' }}
                        draggable={false}
                    />
                    <p style={{
                        ...styles.description,
                        textAlign: 'center',
                    }}>
                        Su pago se encuentra en proceso, por favor, vuelva en otro momento.
                    </p>
                </div>
            }
            { (currentStatus === 'rejected' || currentStatus === 'tryagain') &&
                <div>
                    <p style={{
                        ...styles.title,
                        textAlign: 'center',
                    }}>¡Pago rechazado!</p>
                    <Image
                        src={rechazadoimg}
                        alt="rechazado"
                        style={styles.statusImg}
                        draggable={false}
                    />
                    <p style={{
                        ...styles.description,
                        textAlign: 'center',
                    }}>
                        Lo sentimos, tu pago no pudo ser procesado.
                    </p>
                    <p style={{
                        ...styles.description,
                        textAlign: 'center',
                    }}>
                        <strong>Motivo: </strong>{translateError(message)}
                    </p>
                    { status === 'rejected' &&
                        <p style={{
                            ...styles.description,
                            textAlign: 'center',
                        }}>
                            Por favor, verifica los datos ingresados o intenta con otro método de pago.
                        </p>
                    }
                </div>
            }
            <div style={{ ...styles.buttonContainerStatus,
                    justifyContent: (status === 'rejected' || status === 'tryagain') ? 'left' : 'right'
                }}
            >
                { (status === 'rejected' || status === 'tryagain') && (
                <button
                    type="button"
                    onClick={() => window.location.href = `${ventasUrl}`}
                    style={{
                        ...styles.buttonStatus,
                        backgroundColor: "#5C5C5C",
                    }}
                > Reintentar
                </button>
                )}
                { status === 'approved' && (
                <button
                    type="submit"
                    onClick={() => onUpdateStep(4)}
                    style={styles.buttonStatus}
                > Ver Resumen
                </button>
                )}
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    statusBox: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "space-between",
        padding: '40px 0px',
        overflowY: 'auto',
        overflowX: 'hidden',
        minHeight: '500px',
        width: '100%',
    },
    statusImg: {
        height: 'auto',
        maxHeight: '150px',
        objectFit: 'contain',
        width: '100%',
        paddingTop: '20px',
        paddingBottom: '20px',
        userSelect: 'none',
    },
    title: {
        fontFamily: '"Montserrat", sans-serif',
        fontSize: '32px',
        fontWeight: 'bold',
        marginTop: '0px',
        marginBottom: '16px',
        color: '#222222',
        textAlign: 'left',
    },
    description: {
        fontFamily: '"Roboto", sans-serif',
        fontSize: '16px',
        color: '#2D2D2D',
        marginBottom: '32px',
        textAlign: 'left',
    },
    buttonContainerStatus: {
        display: 'flex',
        marginTop: '16px',
    },
    buttonStatus: {
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
};