// src/components/TabContainer.tsx
'use client'

import { useRef, useState, useEffect } from "react"
import QuotePreviewTab, { QuotePreviewHandle } from './QuotePreviewTab'
import MercadoPagoTab, { MercadoPagoHandle } from './MercadoPagoTab'
import StatusTab from "./StatusTab"
import '@/styles/globals.css' // Funciona para todos los hijos

export default function TabContainer({currentStep, onUpdateStep}: {currentStep: number, onUpdateStep: (step: number) => void}) {
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
                onUpdateStep={onUpdateStep}
            />
        </div>
        <div style={isVisible(2)}>
            { /* MercadoPago: necesita el transaction_amount */ }
            <MercadoPagoTab
                ref={pagoRef}
                transaction_amount={transactionAmount}
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
            <span>Resumen</span>
        </div>
    </div>
    );
};