export const mpvalidators: Record<string, (value: string) => boolean> = {
    // Visa/Mastercard: 4 bloques de 4 dígitos, Amex: 4-6-5 dígitos
    "form-checkout__cardNumber": (v) =>
        /^\d{4} \d{4} \d{4} \d{4}$/.test(v) || // 16 dígitos (4-4-4-4)
        /^\d{4} \d{6} \d{5}$/.test(v),        // 15 dígitos (4-6-5, Amex)
    // DD/MM
    "form-checkout__expirationDate": (v) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v),
    // XYZ / WXYZ
    "form-checkout__securityCode": (v) => /^\d{3,4}$/.test(v),
    // No vacio
    "form-checkout__cardholderName": (v) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/.test(v.trim()),
    // Formato correo@example.com
    "form-checkout__cardholderEmail": (v) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(v),
    // No vacio
    "form-checkout__identificationNumber": (v) => {
        const clean = v.replace(/\./g, "");
        return /^\d{7,8}-[\dkK]$/.test(clean) || clean.trim().length === 9;
    },
};