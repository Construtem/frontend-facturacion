// src/components/utilities/FormatNumberWithDots.tsx

// Transforma formato "123456789" a "123.456.789"
export default function formatNumberWithDots(num: number) {
    const [integerPart] = num.toString().split('.');
    const formatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return formatted;
};