import { MapConfig } from '@boxtal/parcel-point-map/dist/types/model';

declare module '@boxtal/parcel-point-map' {
  export class BoxtalParcelPointMap {
    constructor(options: any);
    searchParcelPoints(params: any, callback: (point: any) => void): void;
    updateConfig(config: MapConfig): void;
  }
}