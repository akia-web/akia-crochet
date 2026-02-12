import { ShipmentStatusEnum } from '@/enum/shipment-status-enum';
import { OrderStatusEnum } from '@/enum/orders-status-enum.ts';

export const traductShipmentStateEnum = (state: ShipmentStatusEnum, isAdminPage: boolean = false) => {
  switch (state) {

    case ShipmentStatusEnum.ACCEPTED:
      return 'Confirmée';
    case ShipmentStatusEnum.ANNOUNCED:
      return isAdminPage? 'Prep': 'En préparation';
    case ShipmentStatusEnum.IN_TRANSIT:
      return 'En transit';
      case ShipmentStatusEnum.OUT_FOR_DELIVERY:
        return 'Acheminement'
    case ShipmentStatusEnum.FAILED_ATTEMPT:
      return 'Problème bloque la livraison'
    case ShipmentStatusEnum.EXCEPTION:
      return 'Problème durant le transit';
    case ShipmentStatusEnum.SHIPPED:
      return 'Expédié';
    case ShipmentStatusEnum.DELIVERED:
      return 'Livré';
    case ShipmentStatusEnum.REACHED_DELIVERY_PICKUP_POINT:
      return 'Colis disponible';
    case ShipmentStatusEnum.RETURNED:
      return 'Colis retourné';
    default:
      return '';
  }
};

export const getSeverityShipmentStatus = (status: ShipmentStatusEnum) => {
  switch (status) {
    case ShipmentStatusEnum.ACCEPTED:
    case ShipmentStatusEnum.ANNOUNCED:
    case ShipmentStatusEnum.IN_TRANSIT:
    case ShipmentStatusEnum.OUT_FOR_DELIVERY:
    case ShipmentStatusEnum.SHIPPED:
      return 'warn';
    case ShipmentStatusEnum.DELIVERED:
    case ShipmentStatusEnum.REACHED_DELIVERY_PICKUP_POINT:
    case ShipmentStatusEnum.RETURNED:
      return 'success'
    case ShipmentStatusEnum.FAILED_ATTEMPT:
    case ShipmentStatusEnum.EXCEPTION:
      return 'danger'
    default:
      return 'warn'
  }
}


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