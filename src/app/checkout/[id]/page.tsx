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
  labelLarge: string;
  labelShort: string;
}

export default function Checkout() {
    const { id: quoteId } = useParams<{ id: string }>();

    // Pasos del proceso de checkout
    const steps: Step[] = [
        { id: 1, labelLarge: "Detalles de pago", labelShort: "Detalles" },
        { id: 2, labelLarge: "Detalles de tarjeta", labelShort: "Tarjeta" },
        { id: 3, labelLarge: "Estado de pago", labelShort: "Estado" },
        { id: 4, labelLarge: "Resumen", labelShort: "Resumen" }, 
    ];

    // Paso actual del checkout
    const [currentStep, setCurrentStep] = useState<number>(1);

    // Determinar si es móvil o no
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [isTablet, setIsTablet] = useState<boolean>(false);

    // Detectar el tamaño de la pantalla
    useEffect(() => {
        const checkSize = () => {
            const innerWidth = window.innerWidth;
            setIsMobile(innerWidth <= 767);
            setIsTablet(innerWidth >= 768 && innerWidth <= 1023);
        };

        checkSize(); // Verificar en primer render
        window.addEventListener('resize', checkSize);

        return () => window.removeEventListener('resize', checkSize);
    }, []);

    return (
        <PageContainerStyled>
            <ContainerWrapperStyled>
                <WizardContainerStyled>
                    {(!isMobile && !isTablet) &&
                        <div style={styles.logoContainer}>
                            <Image src={logo} alt="Logo de la empresa" style={styles.logo} />
                        </div>
                    }
                    <TabWizard steps={steps} currentStep={currentStep} />
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