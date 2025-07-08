// src/components/utilities/ParseDate.tsx

// Para "DD de mes de YYYY"
export function parseLargeDate(date: string) {
    try {
        const myDate = new Date(date);
        if (isNaN(myDate.getTime())) {
            throw new Error('Invalid date');
        }
        const largeDate = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(myDate);
        return largeDate;
    } catch {
        return 'Error en la fecha';
    }
};

// Para "DD/MM/YYYY"
export function parseShortDate(date: string) {
    try {
        const myDate = new Date(date);
        if (isNaN(myDate.getTime())) {
            throw new Error('Invalid date');
        }
        const day = myDate.getDate().toString().padStart(2, '0');
        const month = (myDate.getMonth() + 1).toString().padStart(2, '0');
        const year = myDate.getFullYear();
        return `${day}/${month}/${year}`;
    } catch {
        return 'Error en la fecha';
    }
};