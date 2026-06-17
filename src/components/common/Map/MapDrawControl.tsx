import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";

const DrawControl = ({ onCreated }: { onCreated?: (coords: any) => void }) => {
    const map = useMap();

    useEffect(() => {
        // FeatureGroup is needed to store editable layers
        const drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);

        const drawControl = new L.Control.Draw({
            edit: {
                featureGroup: drawnItems,
            },
            draw: {
                polygon: {},
                polyline: {},
                rectangle: {},
                circle: {},
                marker: {},
            },
        });
        map.addControl(drawControl);

        // Listen for new shapes
        const createdEvent = (L as any).Draw.Event.CREATED;
        map.on(createdEvent, (e: any) => {
            const layer = e.layer;
            drawnItems.addLayer(layer);

            const geojson = layer.toGeoJSON();
            //  Pass to parent if callback exists
            if (onCreated) {
                onCreated(geojson.geometry);
            }
        });

        return () => {
            map.removeControl(drawControl);
        };
    }, [map, onCreated]);

    return null;
};

export default DrawControl;
