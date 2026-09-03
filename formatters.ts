import { Currency } from '../types';

export function formatPrice(
  pricePKR: number,
  priceUSD: number,
  priceAED: number,
  currency: Currency
): string {
  switch (currency) {
    case 'PKR':
      return `Rs. ${pricePKR.toLocaleString('en-PK')}`;
    case 'USD':
      return `$${priceUSD.toLocaleString('en-US')}`;
    case 'AED':
      return `AED ${priceAED.toLocaleString('en-AE')}`;
    default:
      return `Rs. ${pricePKR.toLocaleString('en-PK')}`;
  }
}
