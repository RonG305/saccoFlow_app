"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import DrawControl from "./MapDrawControl";
import "leaflet-draw/dist/leaflet.draw.css";

interface MapViewProps {
  latitude: number;
  longitude: number;
  title?: string;
  zoom?: number;
  name?: string;
  defaultValue?: string;
}

const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    // Start at zoom 10 and animate to 15
    map.setView(center, 10);
    setTimeout(() => {
      map.flyTo(center, 15, { duration: 2.5 });
    }, 500);
  }, [center, map]);

  return null;
};

const MapDrawer = ({
  latitude,
  longitude,
  title,
  name = "geo_coordinates",
}: MapViewProps) => {
  const position: [number, number] = [latitude, longitude];
  const inputRef = useRef<HTMLInputElement>(null);

  const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <div>
      <label className="mb-2 font-medium">{title}</label>
      <MapContainer
        className="rounded-2xl"
        center={position}
        zoom={10} // start zoom level
        scrollWheelZoom={true}
        style={{ minHeight: "70vh", width: "100%" }}
      >
        <ChangeView center={position} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={customIcon}>
          <Popup>
            Location: {latitude}, {longitude}
          </Popup>
        </Marker>

        <DrawControl
          onCreated={(geometry) => {
            if (inputRef.current) {
              inputRef.current.value = geometry ? JSON.stringify(geometry) : "";
            }
          }}
        />
      </MapContainer>

      <input ref={inputRef} type="hidden" name={name} />
    </div>
  );
};

export default MapDrawer;
