import type { ProductDto } from '@/interfaces/product.dto.ts';
import type { ProductVariantDto } from '@/interfaces/product-variant.dto.ts';

export interface ProductShopDto {
    quantity: number;
    product: ProductDto;
    productVariant: ProductVariantDto;
    preOrder:boolean;
    acceptedPreOrder:boolean;
}