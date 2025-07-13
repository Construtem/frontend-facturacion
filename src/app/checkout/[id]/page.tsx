// src/app/checkout/page.tsx
'use client'

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from 'next/image';
import logo from '@/assets/images/logo.png';
import TabWizard from "@/components/utilities/tab-wizard/TabWizard";
import TabContainer from "@/components/TabContainer";
import {
  PageContainerStyled,
  ContainerWrapperStyled,
  WizardContainerStyled,
  TabContainerStyled,
} from '@/components/styled-components/checkout.styles';

interface Step {
  id: number;
  label: string;
}

export default function Checkout() {
    const { id: quoteId } = useParams<{ id: string }>();

    // Pasos del proceso de checkout
    const steps: Step[] = [
        { id: 1, label: "Detalles de pago" },
        { id: 2, label: "Detalles de tarjeta" },
        { id: 3, label: "Estado de pago" },
        { id: 4, label: "Resumen" }, 
    ];

    // Paso actual del checkout
    const [currentStep, setCurrentStep] = useState<number>(1);

    // Determinar si es móvil o no
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState(false)
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);
    const touchEndY = useRef<number | null>(null);

    // Detectar el tamaño de la pantalla
    useEffect(() => {
        const checkSize = () => {
            setIsMobile(window.innerWidth <= 767);
        };

        checkSize(); // Verificar en primer render
        window.addEventListener('resize', checkSize);

        return () => window.removeEventListener('resize', checkSize);
    }, []);

    // Detectar gestos de swipe en móviles
    useEffect(() => {
        if (!isMobile) return;

        // Manejar el inicio y fin del toque
        const handleTouchStart = (e: TouchEvent) => {
            touchStartX.current = e.touches[0].clientX;
            touchStartY.current = e.touches[0].clientY;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            touchEndX.current = e.changedTouches[0].clientX;
            touchEndY.current = e.changedTouches[0].clientY;
            const threshold = 50; // px mínimo para ser considerado swipe
            let deltaY = 0;

            // Calcular la diferencia de Y
            if (touchStartY.current !== null && touchEndY.current !== null) {
                deltaY = Math.abs(touchEndY.current - touchStartY.current);
            }

            // Calcular la diferencia de X
            if (deltaY < threshold && touchStartX.current !== null && touchEndX.current !== null) {
                const deltaX = touchEndX.current - touchStartX.current;

                if (deltaX > threshold) {
                    setIsOpen(true);
                } else if (deltaX < -threshold) {
                    setIsOpen(false);
                }
            }
            touchStartX.current = null;
            touchEndX.current = null;
        };

        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isMobile]);

    return (
        <PageContainerStyled>
            <ContainerWrapperStyled>
                <WizardContainerStyled>
                    <div style={styles.logoContainer}>
                        <Image src={logo} alt="Logo de la empresa" style={styles.logo} />
                    </div>
                    {isMobile ? (
                    <div 
                        style={{
                            ...styles.mobileAcorddion,
                            width: isOpen ? '260px' : '48px',
                            padding: isOpen ? '16px' : '16px 4px',
                        }}
                    >
                        <div
                            onClick={() => setIsOpen(prev => !prev)}
                            style={styles.buttonAcorddion}
                        >
                            {isOpen ? '◀' : '▶'}
                        </div>
                        <div
                            style={{
                                ...styles.mobileTabWizard,
                                display: isOpen ? 'block' : 'none',
                            }}
                        >
                            <TabWizard steps={steps} currentStep={currentStep} />
                        </div>
                    </div>
                    ) : (
                        <TabWizard steps={steps} currentStep={currentStep} />
                    )}
                </WizardContainerStyled>
                <TabContainerStyled>
                    <TabContainer quoteId={Number(quoteId)} currentStep={currentStep} onUpdateStep={setCurrentStep} />
                </TabContainerStyled>
            </ContainerWrapperStyled>
        </PageContainerStyled>
    );
};
const styles: { [key: string]: React.CSSProperties } = {
    logoContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
    logo: {
        width: "150px",
        height: "auto",
    },
    mobileAcorddion: {
        position: 'fixed',
        top: '58px',
        left: 0,
        height: 'calc(100% - 58px)',
        padding: '16px',
        backgroundColor: 'white',
        transition: 'width 0.3s ease, padding 0.3s ease',
        zIndex: 100,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignItems: 'flex-start',
        boxShadow: '2px 0 6px rgba(0,0,0,0.3)',
    },
    buttonAcorddion: {
        backgroundColor: '#f0f0f0',
        color: '#222222',
        width: '100%',
        height: 'auto',
        boxSizing: 'border-box',
        fontSize: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        borderRadius: '16px',
    },
    mobileTabWizard: {
        backgroundColor: '#f0f0f0',
        borderRadius: '16px',
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '24px 16px 24px 16px',
        boxSizing: 'border-box',
    },
}