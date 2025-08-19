import React, { useEffect, useState, useRef } from 'react';
import {
  MapContainer, TileLayer, Marker, Polyline, Popup, useMap,
} from 'react-leaflet';
import L from 'leaflet';

// Bus icon
const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/128/416/416597.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

function AutoCenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);
  return null;
}

export default function MapComponent({
  isPlaying, speed, currentIndex, setCurrentIndex,
}) {
  const [route, setRoute] = useState([]);
  const [animatedPos, setAnimatedPos] = useState(null);
  const animationRef = useRef(null);

  useEffect(() => {
    fetch('/dummy-route.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch route');
        return res.json();
      })
      .then((data) => {
        // Filter out invalid points
        const validData = data.filter((p) => p.latitude !== undefined && p.longitude !== undefined);
        setRoute(validData);
        if (validData.length > 0) {
          setAnimatedPos([validData[0].latitude, validData[0].longitude]);
        }
      })
      .catch((err) => {
        console.error('Error fetching route:', err);
      });
  }, []);

  useEffect(() => {
    if (route.length < 2 || currentIndex >= route.length - 1) {
      cancelAnimationFrame(animationRef.current);
      return;
    }

    const start = [route[currentIndex].latitude, route[currentIndex].longitude];
    const end = [route[currentIndex + 1].latitude, route[currentIndex + 1].longitude];
    const duration = speed;
    let startTime = null;

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const lat = start[0] + (end[0] - start[0]) * progress;
      const lng = start[1] + (end[1] - start[1]) * progress;
      setAnimatedPos([lat, lng]);

      if (progress < 1 && isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
      } else if (progress >= 1 && isPlaying) {
        setCurrentIndex((idx) => Math.min(idx + 1, route.length - 1));
      }
    }

    if (isPlaying) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationRef.current);
    }

    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, speed, currentIndex, route, setCurrentIndex]);

  // Added loading check here before rendering map UI
  if (!animatedPos || !route.length || !route[currentIndex]) {
    return <div>Loading map...</div>;
  }

  const polylineCoords = route.slice(0, currentIndex + 1).map((p) => [p.latitude, p.longitude]);

  return (
    <div style={{ maxWidth: 800, margin: '20px auto' }}>
      <MapContainer center={animatedPos} zoom={16} style={{ height: 400, width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <AutoCenter position={animatedPos} />
        <Marker position={animatedPos} icon={busIcon}>
          <Popup>
            <div>
              <b>Current Position:</b> {animatedPos[0].toFixed(6)}, {animatedPos[1].toFixed(6)} <br />
              <b>Time:</b> {route[currentIndex] ? new Date(route[currentIndex].timestamp).toLocaleTimeString() : 'N/A'}
            </div>
          </Popup>
        </Marker>
        <Polyline positions={polylineCoords} color="#1240ab" />
      </MapContainer>
    </div>
  );
}
