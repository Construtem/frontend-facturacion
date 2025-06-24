// src/components/ResumeTab.tsx
"use client";

import Image from "next/image";
import logo from "@/assets/images/logo.png";

export default function ResumeTab() {

    
    return (
        <div style={styles.enConstruccionBox}>
            <div style={styles.logoContainer}>
                <Image
                src={logo}
                alt="ConstrUTEM Logo"
                style={styles.logoImg}
                />
            </div>
            <div style={{ padding: '24px' }}>
                EN DESARROLLO...
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    enConstruccionBox: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        fontSize: '40px',
        width: '100%',
        minHeight: '500px',
        height: 'auto',
        backgroundColor: 'rgba(255, 145, 0, 0.12)',
        textAlign: 'center',
        alignContent: 'center',
        border: '4px dotted orange',
        borderRadius: '16px',
        position: 'relative',
    },
    logoContainer: {
        padding: '10%',
        height: '100%',
        boxSizing: 'border-box',
        width: 'auto',
        maxHeight: '100%', // Limita la altura máxima al contenedor padre
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImg: {
        maxHeight: '100%', // Limita la altura máxima al contenedor padre
        maxWidth: '100%',  // Limita el ancho máximo al contenedor padre
        objectFit: 'contain',
        height: 'auto',
        width: 'auto',
        display: 'block',
    },
};