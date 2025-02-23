export type Charger = {
  name: string;
  id: string;
  address: string;
  distance: string;
  distance_metrics: string;
  latitude: string;
  longitude: string;
  connector_types: string[];
};


export interface ChargerData {
  chargers: Charger[];
}

export interface Location {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
}
