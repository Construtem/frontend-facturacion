// src/components/utilities/ParseDate.tsx

// Para "DD de mes de YYYY"
export default function parseLargeDate(date: string) {
    const myDate = new Date(date);

    const largeDate = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(myDate);
    return largeDate;
};

// Para "DD/MM/YYYY"
export function parseShortDate({date}: {date: string}) {
    const myDate = new Date(date);

    const shortDate = new Intl.DateTimeFormat('es-ES').format(myDate);
    return shortDate;
};