/*export const validators: Record<string, (value: string) => boolean> = {
    "form-checkout__cardNumber": (v) => /^\d{4} \d{4} \d{4} \d{4}$/.test(v),
    "form-checkout__expirationDate": (v) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v),
    "form-checkout__securityCode": (v) => /^[0-9]{3}$/.test(v),
    "form-checkout__cardholderName": (v) => v.trim().length >= 1,
    "form-checkout__cardholderEmail": (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    "form-checkout__identificationNumber": (v) => v.trim().length >= 1,
    };
*/

export const validators: Record<string, (value: string) => boolean> = {
    // Visa/Mastercard: 4 bloques de 4 dígitos, Amex: 4-6-5 dígitos
    "form-checkout__cardNumber": (v) =>
        /^\d{4} \d{4} \d{4} \d{4}$/.test(v) || // 16 dígitos (4-4-4-4)
        /^\d{4} \d{6} \d{5}$/.test(v),        // 15 dígitos (4-6-5, Amex)
    "form-checkout__expirationDate": (v) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v),
    "form-checkout__securityCode": (v) => /^[0-9]{3,4}$/.test(v),
    "form-checkout__cardholderName": (v) => v.trim().length >= 1,
    "form-checkout__cardholderEmail": (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    "form-checkout__identificationNumber": (v) => v.trim().length >= 1,
};