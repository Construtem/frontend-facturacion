

export function validateRutChileno(rut: string): boolean {
  const cleanRut = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
  if (!/^\d{7,8}[0-9K]$/.test(cleanRut)) return false;
  const body = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1);

  let sum = 0, multiplier = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const expectedDv = 11 - (sum % 11);
  const dvCalc = expectedDv === 11 ? '0' : expectedDv === 10 ? 'K' : expectedDv.toString();

 


  return dvCalc === dv;
}




export const mpvalidators: Record<string, (value: string, context?: { idType?: string }) => boolean> = {
    // Visa/Mastercard: 4 bloques de 4 dígitos, Amex: 4-6-5 dígitos
    "form-checkout__cardNumber": (v) =>
        /^\d{4} \d{4} \d{4} \d{4}$/.test(v) || // 16 dígitos (4-4-4-4)
        /^\d{4} \d{6} \d{5}$/.test(v),        // 15 dígitos (4-6-5, Amex)
    // DD/MM
    "form-checkout__expirationDate": (v) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v),
    // XYZ / WXYZ
    "form-checkout__securityCode": (v) => /^[0-9]{3,4}$/.test(v),
    // No vacio
    "form-checkout__cardholderName": (v) =>/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/.test(v.trim()),
    // Formato correo@example.com
    "form-checkout__cardholderEmail": (v) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(v),
    // DV correcto
    "form-auxiliar__identificationNumber": (v, context) => {
        const idType = context?.idType;
        const clean = v.replace(/\./g, "").replace(/-/g, "");

        if (idType?.toLowerCase() === "otro") {
          return /^[a-zA-Z0-9]{5,20}$/.test(clean);
        } else if (idType?.toLowerCase() === "rut") {
          return validateRutChileno(v);
        }
        return false; 
    }
};