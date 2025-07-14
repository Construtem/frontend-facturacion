import { SiVisa, SiMastercard, SiAmericanexpress, SiGoogleads } from 'react-icons/si';
import { FaUniversity } from 'react-icons/fa';
import { IconType } from 'react-icons';

export type CardType = {
  type: string;
  icon: IconType;
};

export const getCardType = (cardNumber: string): CardType | null => {
  const cleanNumber = cardNumber.replace(/\s+/g, '');
  if (/^4/.test(cleanNumber)) {
    return { type: 'Visa', icon: SiVisa };
  }
  if (/^5[1-5]/.test(cleanNumber)) {
    return { type: 'Mastercard', icon: SiMastercard };
  }
  if (/^3[47]/.test(cleanNumber)) {
    return { type: 'American Express', icon: SiAmericanexpress };
  }
  if (/^5241 0/.test(cleanNumber)) {
    return { type: 'Coopeuch', icon: SiGoogleads };
  }
  if (/^4023 6/.test(cleanNumber)) {
    return { type: 'Scotiabank', icon: FaUniversity };
  }
  return null;
};
