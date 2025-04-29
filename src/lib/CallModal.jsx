// src/lib/CallModal.jsx
'use client';

import React from 'react';
import { useCall } from './CallContext';

export default function CallModal() {
  const { showModal, callRole, incomingCall, accept, reject, end, duration } = useCall();
  if (!showModal) return null;

  const overlayStyle = {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 9998,
  };
  const modalStyle = {
    position: 'fixed',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '300px',
    textAlign: 'center',
    zIndex: 9999,
  };
  const buttonStyle = { margin: '0 8px' };

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <>
      <div style={overlayStyle} />
      <div style={modalStyle}>
        {callRole === 'receiver' && !duration && (
          <>
            <h5>Incoming call from {incomingCall?.username}</h5>
            <button style={buttonStyle} className="btn btn-success" onClick={accept}>
              Accept
            </button>
            <button style={buttonStyle} className="btn btn-danger" onClick={reject}>
              Reject
            </button>
          </>
        )}

        {callRole === 'caller' && !duration && (
          <>
            <h5>Calling…</h5>
            <button style={buttonStyle} className="btn btn-danger" onClick={end}>
              Cancel
            </button>
          </>
        )}

        {duration > 0 && (
          <>
            <h5>Call in progress</h5>
            <p>Duration: {formatTime(duration)}</p>
            <button style={buttonStyle} className="btn btn-danger" onClick={end}>
              End Call
            </button>
          </>
        )}
      </div>
    </>
  );
}
