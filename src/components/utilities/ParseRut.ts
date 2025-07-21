// src/components/utilities/ParseRut.ts

// Para "XX.XXX.XXX-X", con dv "K" => "0"
export function parseRut(rawRut: string) {
    // Elimina todo menos números y la letra K o k
    const cleanRut = rawRut.replace(/[^0-9kK]/g, '').toUpperCase();

    if (cleanRut.length < 2) return cleanRut;

    const cuerpo = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1);

    const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${cuerpoFormateado}-${dv}`;
};