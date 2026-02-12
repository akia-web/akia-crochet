export enum ShipmentStatusEnum {
  ACCEPTED = 'ACCEPTED',
  ANNOUNCED = 'ANNOUNCED', //	Le colis est soit récupéré par le transporteur, soit déposé dans un point de proximité
  SHIPPED = 'SHIPPED', // expédié
  IN_TRANSIT = 'INTRANSIT',// Le colis a été scanné par le transporteur et est en transit
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY', //	Le colis est en cours de livraison
  FAILED_ATTEMPT = 'FAILED_ATTEMPT', //Quelque chose a empêché la livraison du colis
  REACHED_DELIVERY_PICKUP_POINT = 'REACHED_DELIVERY_PICKUP_POINT', //Le colis est disponible pour être récupéré dans un point de proximité
  DELIVERED = 'DELIVERED', // reçu
  RETURNED = 'RETURNED', // Le colis est renvoyé à l'expéditeur
  EXCEPTION = 'EXCEPTION', //Un problème est survenu pendant le transit qui nécessite une action de l'expéditeur
}
