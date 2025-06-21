// src/app/checkout/page.tsx
'use client'

import { useState } from "react";
import Image from 'next/image';
import logo from '@/assets/images/logo.png';
import TabWizard from "@/components/utilities/tab-wizard/TabWizard";
import TabContainer from "@/components/TabContainer";

interface Step {
  id: number;
  label: string;
}

export default function Checkout() {

    // Pasos del proceso de checkout
    const steps: Step[] = [
        { id: 1, label: "Detalles de pago" },
        { id: 2, label: "Detalles de tarjeta" },
        { id: 3, label: "Estado de pago" },
        { id: 4, label: "Resumen" },
    ];

    // Paso actual del checkout
    const [currentStep, setCurrentStep] = useState<number>(1);

    return (
        <div style={styles.containerWrapper}>
            <div style={styles.wizardContainer}>
                <div style={styles.logoContainer}>
                    <Image src={logo} alt="Logo de la empresa" style={styles.logo} />
                </div>
                <TabWizard steps={steps} currentStep={currentStep} />
            </div>
            <div style={styles.tabContainer}>
                <TabContainer currentStep={currentStep} onUpdateStep={setCurrentStep} />
            </div>
        </div>
    );
};
const styles: { [key: string]: React.CSSProperties } = {
    containerWrapper: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: 'white',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
        borderRadius: '16px',
        padding: '32px',
        gap: '16px',
    },
    logoContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
    logo: {
        width: "150px",
        height: "auto",
    },
    wizardContainer: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F0F0F0',
        padding: '32px',
        borderRadius: '16px',
        width: '30%',
        boxSizing: 'border-box',
        gap: '32px',
    },
    tabContainer: {
        position: 'relative',
        minHeight: '500px',
        padding: '16px',
        width: '70%',
    },
}