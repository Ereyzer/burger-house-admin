export type Status = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type PaymentMethod =
  | 'CARD_ONLINE'
  | 'CARD_ON_DELIVERY'
  | 'CASH_ON_DELIVERY'
  | 'BANK_TRANSFER'
  | 'PAYPAL'
  | 'APPLE_PAY'
  | 'GIFT_CARD';
