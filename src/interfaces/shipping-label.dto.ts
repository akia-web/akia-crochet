export interface ShippingLabelDTO {
  id:number;
  estimatedDeliveryDate: string;
  expectedTakingOverDate: string;
  orderBoxtalId:string;
  priceExVat:number;
  priceIncVat:number;
  shipmentBoxtalId:string;
  status:string;
}