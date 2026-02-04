import { ShipmentStatusEnum } from '@/enum/shipment-status-enum';
import { OrderStatusEnum } from '@/enum/orders-status-enum.ts';

export const traductShipmentStateEnum = (state: ShipmentStatusEnum) => {
  switch (state) {

    case ShipmentStatusEnum.ACCEPTED:
      return 'Confirmée';
    case ShipmentStatusEnum.INPREPARATION:
      return 'En préparation';
    case ShipmentStatusEnum.SHIPPED:
      return 'Expédié';
    case ShipmentStatusEnum.DELIVERED:
      return 'Livré';
    case ShipmentStatusEnum.LOSED:
      return 'Perdu';
    case ShipmentStatusEnum.ERROR:
      return 'Erreur';
    default:
      return '';
  }
};

export const traductOrderStatusEnum = (state: OrderStatusEnum) => {
  switch (state) {
    case OrderStatusEnum.PAID:
      return 'Payée';
    case OrderStatusEnum.CANCELED:
      return 'Annulée';
    case OrderStatusEnum.FAILED:
      return 'Paiement échoué';
    case OrderStatusEnum.PENDING:
      return 'En attente';
    case OrderStatusEnum.REFUNDED:
      return 'Remboursée';
  }
};