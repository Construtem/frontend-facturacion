// src/components/TabContainer.tsx
'use client'

import { useRef, useState, useEffect } from "react"
import QuotePreviewTab, { QuotePreviewHandle } from './QuotePreviewTab'
import MercadoPagoTab, { MercadoPagoHandle } from './MercadoPagoTab'
import StatusTab from "./StatusTab"
import ResumeTab from "./ResumeTab" // En construccion
import '@/styles/globals.css' // Funciona para todos los hijos

export default function TabContainer({quoteId, currentStep, onUpdateStep}: {quoteId: number, currentStep: number, onUpdateStep: (step: number) => void}) {
    const quoteRef = useRef<QuotePreviewHandle>(null)
    const pagoRef  = useRef<MercadoPagoHandle>(null)
    const isVisible = (step: number) => ({ display: currentStep === step ? 'block' : 'none' })

    const [transactionAmount, setTransactionAmount] = useState<number | undefined>(undefined);
    const [status, setStatus] = useState<string | undefined>(undefined);
    const [message, setMessage] = useState<string | undefined>(undefined);

    useEffect(() => {
        setTransactionAmount(quoteRef.current?.getAmount());
        setStatus(pagoRef.current?.getStatus());
        setMessage(pagoRef.current?.getMessage());
    }, [currentStep]);

    return (
    <div>
        <div style={isVisible(1)}>
            { /* Cotizacion */ }
            <QuotePreviewTab
                ref={quoteRef}
                quoteId={quoteId}
                onUpdateStep={onUpdateStep}
            />
        </div>
        <div style={isVisible(2)}>
            { /* MercadoPago: necesita el transaction_amount */ }
            <MercadoPagoTab
                ref={pagoRef}
                transaction_amount={transactionAmount}
                cotizacion_id={quoteId}
                onUpdateStep={onUpdateStep}
            />
        </div>
        <div style={isVisible(3)}>
            { /* Estado: necesita el estado y el mensaje de error */ }
            <StatusTab
                status={status}
                message={message}
                onUpdateStep={onUpdateStep}
            />
        </div>
        <div style={isVisible(4)}>
            <ResumeTab />
        </div>
    </div>
    );
};