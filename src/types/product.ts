export interface Product {
    id: number;
    category: string;
    name: string;
    description: string;
    price: string;
    stock: number;
    image_url: string;
    product_size: string;
    created_at: string;
  }
  
  export interface CartItem {
    id: string;
    productName: string;
    price: string;
    imageSrc: string;
    quantity: number;
  }
  