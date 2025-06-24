// src/components/StatusTab.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import rechazadoimg from "@/assets/images/rechazado.png";
import aprobadoimg from "@/assets/images/aprobado.png";

export default function StatusTab({status, message, onUpdateStep}: {status: string | undefined, message: string | undefined, onUpdateStep: (step: number) => void}) {

    const [isApproved, setIsApproved] = useState<boolean>(false);
    
    const translateError = (error: string | undefined): string => {
        if (error === "cc_rejected_insufficient_amount") {
            return "Su tajeta no tiene fondos suficientes para realizar el pago.";
        }
        else if (error === "a") {
            return "a"; // otros errores
        }
        return "Ha ocurrido un error inesperado.";
    };

    useEffect(() => {
        setIsApproved(status === 'approved');
    }, [status]);
    
    return (
        <div style={styles.statusBox}>
            { isApproved &&
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
            { !isApproved &&
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
                    <p style={{
                        ...styles.description,
                        textAlign: 'center',
                    }}>
                        Por favor, verifica los datos ingresados o intenta con otro método de pago.
                    </p>
                </div>
            }
            <div style={{ ...styles.buttonContainerStatus,
                    justifyContent: !isApproved ? 'left' : 'right'
                }}
            >
                { !isApproved ?
                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    style={{
                        ...styles.buttonStatus,
                        backgroundColor: "#5C5C5C",
                    }}
                > Reintentar
                </button>
                :
                <button
                    type="submit"
                    onClick={() => onUpdateStep(4)}
                    disabled={!isApproved}
                    style={styles.buttonStatus}
                > Ver Resumen
                </button>
                }
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    statusBox: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "space-between",
        padding: '40px',
        overflowY: 'auto',
        minHeight: '500px',
        width: 'auto',
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