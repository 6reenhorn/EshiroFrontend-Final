export interface CartItem {
  id: number;
  productName: string;
  price: string;
  image_Url: string;
  size?: string;
  quantity: number;
  isSelected: boolean;
  product_id: number; // Add this field to match the backend API response
}