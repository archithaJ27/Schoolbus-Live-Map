import React, { useState } from 'react';
import MapComponent from './components/MapComponent';
import Controls from './components/Controls';
import 'leaflet/dist/leaflet.css';



export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2000);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };
  const handleSpeedChange = (newSpeed) => setSpeed(newSpeed);

  return (
    <div>
      <h1 style={{ textAlign: 'center', color: '#1240ab' }}>School Bus Tracker</h1>
      <Controls
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={handleSpeedChange}
      />
      <MapComponent
        isPlaying={isPlaying}
        speed={speed}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
      <footer style={{ textAlign: 'center', padding: 16, color: '#555' }}>
        <small>Simulated School Bus tracking • Made for Blockly Technologies</small>
      </footer>
    </div>
  );
}
