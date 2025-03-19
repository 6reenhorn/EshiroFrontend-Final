export interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: string;
    image_url: string | null;
  };
  quantity: number;
}