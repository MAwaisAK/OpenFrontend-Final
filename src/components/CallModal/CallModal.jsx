// CallModal.jsx
import React, { useContext } from "react";
import { CallContext } from "../../lib/CallContext";

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

const CallModal = () => {
  const { callState, handleAcceptCall, handleRejectCall, endCall } =
    useContext(CallContext);
  const { show, callRole, callAccepted, callTime, incomingCall } = callState;

  if (!show) return null;

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 9999,
        }}
      />
      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10000,
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "300px",
          textAlign: "center",
        }}
      >
        {callRole === "caller" ? (
          <>
            {!callAccepted ? (
              <>
                <h5>Calling...</h5>
                <button className="btn btn-danger" onClick={endCall}>
                  End Call
                </button>
              </>
            ) : (
              <>
                <h5>Call in progress</h5>
                <div>Time: {formatTime(callTime)}</div>
                <button className="btn btn-danger" onClick={endCall}>
                  End Call
                </button>
              </>
            )}
          </>
        ) : (
          <>
            {!callAccepted ? (
              <>
                <h5>
                  Incoming call from {incomingCall?.username || "Unknown"}
                </h5>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    marginTop: "15px",
                  }}
                >
                  <button className="btn btn-success" onClick={handleAcceptCall}>
                    Accept
                  </button>
                  <button className="btn btn-danger" onClick={handleRejectCall}>
                    Reject
                  </button>
                </div>
              </>
            ) : (
              <>
                <h5>Call in progress</h5>
                <div>Time: {formatTime(callTime)}</div>
                <button className="btn btn-danger" onClick={endCall}>
                  End Call
                </button>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default CallModal;
