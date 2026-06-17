'use client';

import {
    MapContainer,
    TileLayer,
    Polygon,
    Marker,
    Popup,
    useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';

const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface Land {
    id: string;
    lr_number: string;
    location: {
        county: string;
        sub_county: string;
        geo_coordinates: {
            type: string;
            coordinates: any;
        };
    };
    current_owner_name: string;
    zoning_classification: string;
}

const ChangeView = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        if (center[0] && center[1]) {
            map.flyTo(center, 16, { duration: 2 });
        }
    }, [center]);
    return null;
};

export default function ProjectLandsMap() {
    const [lands, setLands] = useState<Land[]>([]);
    const [search, setSearch] = useState('');
    const [selectedCenter, setSelectedCenter] = useState<[number, number]>([1.2921, 36.8219]); 

    useEffect(() => {
        const fetchLands = async () => {
            // const response = await makeApiRequest(`${BACKEND_URL}/lands/stage/APPROVED`);
            setLands([]);
        };
        fetchLands();
    }, []);

    // handle search
    const handleSearch = () => {
        const found = lands.find(l => l.lr_number.toLowerCase() === search.toLowerCase());
        if (found?.location?.geo_coordinates) {
            const coords = found.location.geo_coordinates;
            if (coords.type === 'Polygon') {
                const pts = coords.coordinates[0].map(([lng, lat]: number[]) => [lat, lng]);
                const avgLat = pts.reduce((a: number, [lat]: [number, number]) => a + lat, 0) / pts.length;
                const avgLng = pts.reduce((a: number, [, lng]: [number, number]) => a + lng, 0) / pts.length;
                setSelectedCenter([avgLat, avgLng]);
            } else if (coords.type === 'Point') {
                const [lng, lat] = coords.coordinates;
                setSelectedCenter([lat, lng]);
            }
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Search by LR Number..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border px-3 py-2 rounded-lg w-64"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg"
                >
                    Search
                </button>
            </div>

            <MapContainer
                center={selectedCenter}
                zoom={10}
                scrollWheelZoom
                style={{ height: '80vh', width: '100%', borderRadius: '1rem' }}
            >
                <ChangeView center={selectedCenter} />

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {lands?.map((land) => {
                    const coords = land.location.geo_coordinates;
                    if (!coords) return null;

                    if (coords.type === 'Polygon') {
                        const positions = coords.coordinates[0].map(([lng, lat]: number[]) => [lat, lng]);
                        return (
                            <Polygon
                                key={land.id}
                                positions={positions}
                                pathOptions={{ color: 'blue', weight: 2 }}
                            >
                                <Popup>
                                    <strong>LR Number:</strong> {land.lr_number} <br />
                                    <strong>Owner:</strong> {land.current_owner_name} <br />
                                    <strong>County:</strong> {land.location.county} <br />
                                    <strong>Zoning:</strong> {land.zoning_classification}
                                </Popup>
                            </Polygon>
                        );
                    } else if (coords.type === 'Point') {
                        const [lng, lat] = coords.coordinates;
                        return (
                            <Marker key={land.id} position={[lat, lng]} icon={customIcon}>
                                <Popup>
                                    <strong>LR Number:</strong> {land.lr_number} <br />
                                    <strong>Owner:</strong> {land.current_owner_name}
                                </Popup>
                            </Marker>
                        );
                    }
                    return null;
                })}
            </MapContainer>
        </div>
    );
}
