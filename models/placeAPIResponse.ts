import MapView, { LatLng } from "react-native-maps";

export interface Viewport {
  northeast: LatLng;
  southwest: LatLng;
}
export interface Geometry {
  location: LatLng;
  viewport: Viewport;
}
export interface PlaceSingleResult {
  business_status: string;
  formatted_address: string;
  geometry: { location: LatLng };
  icon: string;
  name: string;
  place_id: string;
}
export interface PlaceAPIResponce {
  html_attributions: string;
  results: PlaceSingleResult[];
}
