'use client';

import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import DrawControl from './MapDrawControl';
import styles from './mapview.module.css';
interface MapViewProps {
  height?: string;
  latitude?: number;
  longitude?: number;
  title?: string;
  zoom?: number;
  location? : {
    county: string;
    sub_county: string;
    geo_coordinates?: any | null;
  };
}

const ChangeView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  

  useEffect(() => {
    map.setView(center, 10);
    setTimeout(() => {
      map.flyTo(center, 16, { duration: 2.5 });
    }, 300);
  }, [center, map]);

  return null;
};

const MapView = ({ latitude, longitude, title, zoom = 15, location, height='40vh' }: MapViewProps) => {
  const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  let position: [number, number] = [latitude ?? 0, longitude ?? 0];

  let shapeLayer = null;

  if (location?.geo_coordinates) {
    const { type } = location.geo_coordinates;

    if (type === 'Polygon') {
      const coords = location.geo_coordinates.coordinates[0].map(([lng, lat]: number[]) => [lat, lng]);
      const avgLat = coords.reduce((sum: number, [lat]: [number, number]) => sum + lat, 0) / coords.length;
      const avgLng = coords.reduce((sum: number, [, lng]: [number, number]) => sum + lng, 0) / coords.length;
      position = [avgLat, avgLng];
      shapeLayer = (
        <Polygon positions={coords} pathOptions={{ color: 'blue', weight: 2 }}>
          <Popup>{title || 'Land Polygon'}</Popup>
        </Polygon>
      );
    }

    else if (type === 'LineString') {
      const coords = location.geo_coordinates.coordinates.map(([lng, lat]: number[]) => [lat, lng]);
      const mid = Math.floor(coords.length / 2);
      position = coords[mid];
      shapeLayer = (
        <Polyline positions={coords} pathOptions={{ color: 'green', weight: 3 }}>
          <Popup>{title || 'Boundary Line'}</Popup>
        </Polyline>
      );
    }

    else if (type === 'Point') {
      const [lng, lat] = location.geo_coordinates.coordinates;
      position = [lat, lng];
      shapeLayer = (
        <Marker position={position} icon={customIcon}>
          <Popup>{title || 'Point Location'}</Popup>
        </Marker>
      );
    }
  }

  return (
    <div className={styles.mapviewContainer}>
      <h2 className='text-secondary font-medium mb-2'>{title}</h2>
      <MapContainer
        className='rounded-2xl'
        center={position}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ minHeight: height, width: '100%' , borderRadius: '16px'}}
      >
        <ChangeView center={position} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        {shapeLayer}
        <DrawControl />
      </MapContainer>
    </div>
  );
};

export default MapView;
