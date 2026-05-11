import type { ProductShopDto } from '@/interfaces/product-shop.dto.ts';
import type { TransporterDto } from '@/interfaces/transporter.dto.ts';

export const calculateLivraisonPrice = (productsCart: ProductShopDto[], transporter: TransporterDto): number => {

  const totalWeight = productsCart.reduce(
    (total, product) => total + (product.productVariant?.weight || 0),
    0
  );

  const weightPrice = transporter.weightPrice.find(
    item => item.weight >= totalWeight
  );

  if (!weightPrice) {
    return 0;
  }

  const priceHT: number = weightPrice.price / 100;
  const priceTTC: number = priceHT * 1.25;
  return Number(priceTTC.toFixed(2));
};