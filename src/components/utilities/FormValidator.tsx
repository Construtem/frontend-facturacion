// src/components/utilities/FormValidator.tsx

import { useState, useEffect, useRef } from "react";

type FieldValidity = { [key: string]: boolean | null };
type ValidatorsMap = { [key: string]: (value: string) => boolean };

export function useFormValidator(fieldIds: string[], validators: ValidatorsMap) {
    const initialValidity: FieldValidity = fieldIds.reduce((acc, id) => {
        acc[id] = null;
        return acc;
    }, {} as FieldValidity); // todo en null

    const [fieldValidity, setFieldValidity] = useState<FieldValidity>(initialValidity);
    const [isFormValid, setIsFormValid] = useState(false);

    const hasInitialized = useRef(false);
    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        const listeners: { element: Element; handler: (event: FocusEvent) => void }[] = [];

        fieldIds.forEach((id) => {
            const element = document.getElementById(id);
            if (!element) return;

            const handleBlur = (event: FocusEvent) => {
            const input = event.target as HTMLInputElement | HTMLSelectElement;
            const value = input.value;
            const validator = validators[id];
            const isValid = validator ? validator(value) : value.length > 0;

            setFieldValidity(prev => ({
            ...prev,
            [id]: isValid,
            })); // actualiza si es valido o invalido
        };

        element.addEventListener("blur", handleBlur);
        listeners.push({ element, handler: handleBlur });
        });
    }, [fieldIds, validators]);

    useEffect(() => {
        setIsFormValid(Object.values(fieldValidity).every(Boolean));
    }, [fieldValidity]); // todos campos validos = form valido

    return { fieldValidity, isFormValid };
}