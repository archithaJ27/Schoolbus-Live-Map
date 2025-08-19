import React from 'react';

export default function Controls({ isPlaying, onPlay, onPause, onReset, speed, onSpeedChange }) {
  return (
    <div style={{ margin: '10px', textAlign: 'center' }}>
      {!isPlaying ? (
        <button onClick={onPlay} style={buttonStyle}>Play</button>
      ) : (
        <button onClick={onPause} style={buttonStyle}>Pause</button>
      )}
      <button onClick={onReset} style={buttonStyle}>Reset</button>

      <label style={{ marginLeft: 20, color: '#1240ab', fontWeight: 'bold' }}>
        Speed:
        <select
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          style={{ marginLeft: 10, padding: 4, borderRadius: 4 }}
        >
          <option value={5000}>Slow</option>
          <option value={2000}>Normal</option>
          <option value={800}>Fast</option>
        </select>
      </label>
    </div>
  );
}

const buttonStyle = {
  backgroundColor: '#1240ab',
  color: 'white',
  fontWeight: 'bold',
  padding: '8px 12px',
  marginRight: 10,
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

