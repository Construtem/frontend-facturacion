// src/components/TabContainer.tsx
'use client'

import { useRef, useState, useEffect } from "react"
import QuotePreviewTab, { QuotePreviewHandle } from './QuotePreviewTab'
import MercadoPagoTab, { MercadoPagoHandle } from './MercadoPagoTab'
import StatusTab from "./StatusTab"
import SummaryTab from "./SummaryTab" // En construccion
import '@/styles/globals.css' // Funciona para todos los hijos

interface AmountDetails {
  fecha_emision: string,
  subtotal: number,
  impuesto: number,
  total: number,
}

export default function TabContainer({quoteId, currentStep, onUpdateStep}: {quoteId: number, currentStep: number, onUpdateStep: (step: number) => void}) {
    const quoteRef = useRef<QuotePreviewHandle>(null)
    const pagoRef  = useRef<MercadoPagoHandle>(null)
    const isVisible = (step: number) => ({ display: currentStep === step ? 'block' : 'none' })

    const [transactionAmount, setTransactionAmount] = useState<number | undefined>(undefined);
    const [amountDetails, setAmountDetails] = useState<AmountDetails | undefined>(undefined);
    const [previewQuoteId, setPreviewQuoteId] = useState<string | undefined>(undefined);
    const [status, setStatus] = useState<string | undefined>(undefined);
    const [isPagado, setIsPagado] = useState<string | undefined>(undefined);
    const [message, setMessage] = useState<string | undefined>(undefined);

    useEffect(() => {
        setTransactionAmount(quoteRef.current?.getAmount());
        setPreviewQuoteId(quoteRef.current?.getPreviewQuoteId());
        setAmountDetails(quoteRef.current?.getAmountDetails());
        setIsPagado(quoteRef.current?.getIsPagado());
        const newIsPagado = quoteRef.current?.getIsPagado();
        switch (newIsPagado) {
            case 'nuevo':
                setStatus(pagoRef.current?.getStatus());
                setMessage(pagoRef.current?.getMessage());
                break;
            case 'en proceso':
                setStatus('en proceso');;
                break;
            case 'tryagain':
                setStatus('tryagain');
                setMessage('try_other_quote');
                break;
            case 'approved':
                setStatus('approved');
                break;
        }   
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
                previewQuoteId={previewQuoteId}
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
            <SummaryTab
                status={status}
                previewQuoteId={previewQuoteId}
                isPagado={isPagado}
                amountDetails={amountDetails}
            />
        </div>
    </div>
    );
};