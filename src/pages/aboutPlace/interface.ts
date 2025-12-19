export interface OpenDay {
  dayOfWeek: number;
  opensAt: string | null;
  closesAt: string | null;
}

export interface BrakeTime {
  workDate: string;
  closesAt: string;
  opensAt: string;
  id: string;
}

export interface DeliveryPrice {
  id: string;
  deliveryPrice: number;
  distance: number;
  minOrder: number;
}
