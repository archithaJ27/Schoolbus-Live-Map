import React from 'react';

export default function Controls({ isPlaying, onPlay, onPause, onReset, speed, onSpeedChange }) {
  return (
    <div style={{ margin: '10px', textAlign: 'center' }}>
      {!isPlaying ? (
        <button style={btnStyle} onClick={onPlay}>Play</button>
      ) : (
        <button style={btnStyle} onClick={onPause}>Pause</button>
      )}
      <button style={btnStyle} onClick={onReset}>Reset</button>
      <label style={{ marginLeft: 15, color: '#1240ab', fontWeight: 'bold' }}>
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

const btnStyle = {
  backgroundColor: '#1240ab',
  color: 'white',
  fontWeight: 'bold',
  padding: '8px 14px',
  marginRight: 10,
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
};

