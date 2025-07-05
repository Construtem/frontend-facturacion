// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function CheckoutRedirect() {
  redirect(`/checkout/1`);
}
// Se redirige a checkout