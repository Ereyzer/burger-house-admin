export interface AddMenuItemDto {
  title: string;
  subtitle?: string;
  price: number;
  onboard: boolean;
  description?: string;
  calories?: number;
  categories: string[];
  drinks: number[];
  dishes: number[];
}

export interface UpdateMenuItemDto {
  id: number;
  title: string;
  subtitle: string;
  price: number;
  onboard: boolean;
  description: string;
  calories: number;
}
