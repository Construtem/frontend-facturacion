// src/components/utilities/FormValidator.tsx

import { useState, useEffect } from "react";

type FieldValidity = { [key: string]: boolean | null };
// eslint-disable-next-line
type ValidatorsMap = { [key: string]: (value: string, context?: any) => boolean };

// eslint-disable-next-line
export function useFormValidator(fieldIds: string[], validators: ValidatorsMap, formKey: number, context: any = {}) {
    const initialValidity: FieldValidity = fieldIds.reduce((acc, id) => {
        acc[id] = null;
        return acc;
    }, {} as FieldValidity); // todo en null

    const [fieldValidity, setFieldValidity] = useState<FieldValidity>(initialValidity);
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const listeners: { element: Element; handler: (event: FocusEvent) => void }[] = [];

        fieldIds.forEach((id) => {
            const element = document.getElementById(id);
            if (!element) return;

            const handleBlur = (event: FocusEvent) => {
            const input = event.target as HTMLInputElement | HTMLSelectElement;
            const value = input.value;
            const validator = validators[id];
            const isValid = validator ? validator(value, context) : value.length > 0;

            setFieldValidity(prev => ({
                ...prev,
                [id]: isValid,
            }));
            };

            element.addEventListener("blur", handleBlur);
            listeners.push({ element, handler: handleBlur });
        });

        // Cleanup: eliminar los listeners cuando cambie context, validators, etc.
        return () => {
            listeners.forEach(({ element, handler }) => {
            element.removeEventListener("blur", handler as EventListener);
            });
        };
    }, [fieldIds, validators, formKey, context]);


    useEffect(() => {
        setIsFormValid(Object.values(fieldValidity).every(Boolean));
    }, [fieldValidity]); // todos campos validos = form valido

    return { fieldValidity, isFormValid };
}