export const validators: Record<string, (value: string) => boolean> = {
    "form-checkout__cardNumber": (v) => /^\d{4} \d{4} \d{4} \d{4}$/.test(v),
    "form-checkout__expirationDate": (v) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v),
    "form-checkout__securityCode": (v) => /^[0-9]{3}$/.test(v),
    "form-checkout__cardholderName": (v) => v.trim().length >= 1,
    "form-checkout__cardholderEmail": (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    "form-checkout__identificationNumber": (v) => v.trim().length >= 1,
    };