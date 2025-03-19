export interface CartItem {
  id: number;
  product_id: number;      // was product.id
  product_name: string;    // was product.name
  product_price: string;   // was product.price
  product_image: string | null; // was product.image_url
  quantity: number;
}