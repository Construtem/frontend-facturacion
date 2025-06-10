"use client";

import Image from "next/image";
import rechazadoimg from "@/styles/images/rechazado.png";
import aprobadoimg from "@/styles/images/aprobado.png";
import Header from "@/components/admin/header";
import Link from "next/link";
import { useParams, useSearchParams } from 'next/navigation';

const ResultadoMP = () => {
    const params = useParams();
    const id = params.id;
    const searchParams = useSearchParams();
    const status = searchParams.get('status');
    const message = searchParams.get('message');

    return (
        <div style={styles.pageBackground}>
        { <Header onToggleSidebar={() => {}} /> }
        <div style={styles.statusWrapper}>
            <div style={styles.statusBox}>
                {status === 'approved' &&
                    <div>
                        <p style={styles.title}>
                            ¡Pago aprobado!
                        </p>
                        <Image
                            src={aprobadoimg}
                            alt="aprobado"
                            style={styles.statusImg as React.CSSProperties}
                            draggable={false}
                        />
                        <p style={styles.subtitle}>
                            Gracias por tu compra. El pago fue procesado correctamente.
                        </p>
                        {/*<Link
                            href={`/catalogo/${id}`}
                            type="button"
                            style={{
                                ...styles.button,
                                backgroundColor: "#ff8000",
                            }}
                            > Ver mi catálogo
                        </Link>*/}
                        <div style={{ paddingBottom: '40px' }}></div>
                    </div>
                }
                {status === 'rejected' &&
                    <div>
                        <p style={styles.title}>¡Pago rechazado!</p>
                        <Image
                            src={rechazadoimg}
                            alt="rechazado"
                            style={styles.statusImg as React.CSSProperties}
                            draggable={false}
                        />
                        <p style={styles.subtitle}>
                            Lo sentimos, tu pago no pudo ser procesado.
                        </p>
                        <p style={styles.subtitle}>
                            Motivo: {message || "Problemas del servidor."}
                        </p>
                        <p style={styles.subtitle}>
                            Por favor, verifica los datos ingresados o intenta con otro método de pago.
                        </p>
                        <Link
                            href={`/pago/${id}`}
                            type="button"
                            style={{
                                ...styles.button,
                                backgroundColor: "#333",
                            }}
                            > Reintentar pago
                        </Link>
                        <div style={{ paddingBottom: '40px' }}></div>
                    </div>
                }
            </div>
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
  statusWrapper: {
    position: 'relative',
    display: 'flex',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
    maxHeight: 'calc(90vh - 58px)',
    borderRadius: '10px',
  },
  statusBox: {
    display: 'flex',
    justifyContent: "center",
    padding: '40px',
    overflowY: 'auto',
    width: '800px',
    backgroundColor: '#ffffff',
  },
  statusImg: {
    height: 'auto',
    maxHeight: '150px',
    objectFit: 'contain',
    width: '100%',
    paddingTop: '20px',
    paddingBottom: '20px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#222',
    fontFamily: '"Montserrat", sans-serif',
  },
  subtitle: {
    fontSize: '18px',
    fontWeight: 'normal',
    marginBottom: '10px',
    marginTop: '10px',
    textAlign: 'center',
    color: '#555',
    fontFamily: '"Roboto", sans-serif',
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
    width: '100%',
  },
};

export default ResultadoMP;
