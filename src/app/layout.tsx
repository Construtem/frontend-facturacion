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