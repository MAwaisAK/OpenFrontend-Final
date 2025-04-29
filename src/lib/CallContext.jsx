// src/lib/CallContext.jsx
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const SOCKET_ENDPOINT = process.env.NEXT_PUBLIC_BASE_ENDPOINT_SOCKET;

const CallContext = createContext(null);

export function CallProvider({ children, userId }) {
  const [socket] = useState(() =>
    io(SOCKET_ENDPOINT, { auth: { userId } })
  );
  const [lobby, setLobby] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callRole, setCallRole] = useState(''); // 'caller' | 'receiver'
  const [duration, setDuration] = useState(0);
  const [timer, setTimer] = useState(null);

  // Auto-join the socket room whenever lobby changes
  useEffect(() => {
    if (lobby) {
      socket.emit('join', { chatLobbyId: lobby, userId });
    }
  }, [lobby, socket, userId]);

  const cleanup = () => {
    setShowModal(false);
    setIncomingCall(null);
    setCallRole('');
    setDuration(0);
    if (timer) clearInterval(timer);
  };

  // Listen for incoming call events
  useEffect(() => {
    socket.on('incomingCall', (caller) => {
      setIncomingCall(caller);
      setCallRole('receiver');
      setShowModal(true);
    });
    socket.on('notifyCallReceived', () => {
      setCallRole('caller');
      setShowModal(true);
      const t = setInterval(() => setDuration((d) => d + 1), 1000);
      setTimer(t);
    });
    socket.on('callEnded', cleanup);
    socket.on('callNotReceived', cleanup);
    return () => {
      socket.off('incomingCall');
      socket.off('notifyCallReceived');
      socket.off('callEnded');
      socket.off('callNotReceived');
    };
  }, [socket, timer]);

  // Caller: start a call
  const callUser = (chatLobbyId, receiverId) => {
    setLobby(chatLobbyId);
    setCallRole('caller');
    setShowModal(true);
    socket.emit('initializeAudioCall', { chatLobbyId, callerId: userId, receiverId });
  };

  // Receiver accepts
  const accept = () => {
    socket.emit('callReceived', { chatLobbyId: lobby, receiverId: userId });
    socket.emit('createMessage', {
      room: lobby,
      sender: userId,
      text: '',
      type: 'call',
      callStatus: 'picked',
    });
  };

  // Receiver rejects
  const reject = () => {
    socket.emit('callNotReceived', { chatLobbyId: lobby, receiverId: userId });
    socket.emit('createMessage', {
      room: lobby,
      sender: userId,
      text: '',
      type: 'call',
      callStatus: 'canceled',
    });
    cleanup();
  };

  // Either side ends
  const end = () => {
    socket.emit('callEnded', { chatLobbyId: lobby, userId });
    cleanup();
  };

  return (
    <CallContext.Provider
      value={{
        callUser,
        incomingCall,
        callRole,
        showModal,
        accept,
        reject,
        end,
        duration,
      }}
    >
      {children}
    </CallContext.Provider>
  );
}

export function useCall() {
  const ctx = useContext(CallContext);
  if (!ctx) throw new Error('useCall must be used within CallProvider');
  return ctx;
}
