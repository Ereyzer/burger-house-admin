export interface AddMenuItemDto {
  title: string;
  subtitle?: string;
  price: number;
  onboard: boolean;
  description?: string;
  calories?: number;
  categories: string[];
  drinks: string[];
  dishes: string[];
}

export interface UpdateMenuItemDto {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  onboard: boolean;
  description: string;
  calories: number;
}
