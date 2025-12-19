import type { PaymentMethod, Status } from './types';

interface Selection {
  menu_id: number;
  quantity: number;
  selection: {
    id: number;
    title: string;
    subtitle: string;
    price: number;
  };
}

export interface FullOrder {
  id: string;
  amount: number;
  payment: PaymentMethod;
  phone: string;
  customerName: string;
  delivery: boolean;
  street: '';
  status: Status;
  addressFull: string;
  addressClarification: string;
  description?: string | null;
  createdAt: Date;
  selections: Selection[];
}
