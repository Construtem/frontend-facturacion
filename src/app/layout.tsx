// src/app/layout.tsx

"use client";

import { useRef, useLayoutEffect, useState } from "react";
import Header from "@/components/Header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const headerRef = useRef<HTMLDivElement | null>(null);
    const [headerHeight, setHeaderHeight] = useState(0);

    useLayoutEffect(() => {
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.offsetHeight);
        }

        const MAX_ZOOM = 1.40;
        const MIN_ZOOM = 0.67;

        // Mantiene el tamaño de la pagina en el intervalo de MIN_ZOOM y MAX_ZOOM
        const handleResize = () => {
            const zoomLevel = window.screen.width / window.innerWidth;

            if (zoomLevel > MAX_ZOOM) {
                document.body.style.zoom = `${MAX_ZOOM/zoomLevel}`;
            } else if (zoomLevel < MIN_ZOOM) {
                document.body.style.zoom = `${MIN_ZOOM/zoomLevel}`;
            } else {
                document.body.style.zoom = '1';
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <title>Pago</title>
            <meta name="description" content="Pestaña de pago mediante Mercado Pago" />
            <html lang="es">
                <body style={styles.body}>
                    <Header ref={headerRef} />
                    <div style={{ height: headerHeight }} />
                    <div style={styles.children}>
                        {children}
                    </div>
                </body>
            </html>
        </>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    body: {
        backgroundColor: '#F7F7F7',
        color: '#222222',
        fontFamily: '"Roboto", sans-serif',
        fontSize: '16px',
    },
    children: {
        position: 'relative',
        margin: '48px',
    },
}