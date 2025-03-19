export interface CartItem {
  id: number;
  product_id: number;
  product: {
    name: string;
    price: string;
    image_url: string;
  };
  size?: string;
  quantity: number;
  isSelected: boolean;
}