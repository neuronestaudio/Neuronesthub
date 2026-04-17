import React from 'react';

export default function SoundHub() {
  return (
    <div style={{ color: 'white', background: 'black', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <h1>Sound Hub</h1>
      <p>This is the React Sound Hub app, now separated from the main homepage.</p>
      <a href="/" style={{ marginTop: 32, color: '#fff', background: '#222', padding: '12px 32px', borderRadius: 24, textDecoration: 'none', fontWeight: 600, letterSpacing: 1 }}>Home</a>
    </div>
  );
}
