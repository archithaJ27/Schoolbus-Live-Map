import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';

const vehicleIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854894.png',
  iconSize: [32, 32],
});

export default function MapComponent({ isPlaying, speed, currentIndex, setCurrentIndex }) {
  const [route, setRoute] = useState([]);
  const intervalRef = useRef(null);

  // Load route data from dummy-route.json in public folder
  useEffect(() => {
    fetch('/dummy-route.json')
      .then((res) => res.json())
      .then((data) => setRoute(data));
  }, []);

  // Manage the vehicle position timer
  useEffect(() => {
    if (isPlaying && route.length) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((idx) => {
          if (idx < route.length - 1) {
            return idx + 1;
          } else {
            clearInterval(intervalRef.current);
            return idx;
          }
        });
      }, speed);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, speed, route, setCurrentIndex]);

  if (!route.length) return <div>Loading route data...</div>;
  const currentPoint = route[currentIndex];

  // Polyline from start till current index
  const polylineCoords = route.slice(0, currentIndex + 1).map((p) => [p.latitude, p.longitude]);

  return (
    <div style={{ width: '90%', maxWidth: 800, margin: '0 auto' }}>
      <MapContainer
        center={[currentPoint.latitude, currentPoint.longitude]}
        zoom={16}
        scrollWheelZoom={false}
        style={{ height: 400, borderRadius: 10, boxShadow: '0 0 8px rgba(18,64,171,0.3)' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[currentPoint.latitude, currentPoint.longitude]} icon={vehicleIcon}>
          <Popup>
            <div>
              <b>Coords:</b> {currentPoint.latitude.toFixed(6)}, {currentPoint.longitude.toFixed(6)} <br />
              <b>Time:</b> {new Date(currentPoint.timestamp).toLocaleTimeString()}
            </div>
          </Popup>
        </Marker>
        <Polyline positions={polylineCoords} color="#1240ab" />
      </MapContainer>

      <div style={{ marginTop: 12, textAlign: 'center', color: '#1240ab', fontWeight: 'bold' }}>
        Current Position: {currentIndex + 1} / {route.length}
      </div>
    </div>
  );
}
