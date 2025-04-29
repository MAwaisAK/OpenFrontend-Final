"use client";
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { getChatLobby, fetchMe,createChatLobbyRequest, getUsersInfoChat} from "../../app/api"; // Adjust paths as needed
import moment from "moment";
import $ from "jquery";
import Script from "next/script";
import "../../styles/admin_assets/css/app.min.css";
import "../../styles/admin_assets/css/components.css";

// Base endpoint (adjust as needed)
const BASE_ENDPOINT =
  process.env.NEXT_PUBLIC_BASE_ENDPOINT;
  
  const SOCKET_ENDPOINT =
  process.env.NEXT_PUBLIC_BASE_ENDPOINT_SOCKET;


export default function ChatAppMerged() {
  // Chat state
  const [authUser, setAuthUser] = useState(null);
  const [credentials, setCredentials] = useState({
    name: "",
    room: "", // this is the chat lobby ID
    userId: "",
  });
  const [socket, setSocket] = useState(null);
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenCount, setUnseenCount] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const chatContentRef = useRef(null);

  // Call-related state
  const [showCallModal, setShowCallModal] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callRole, setCallRole] = useState(""); // "caller" or "receiver"
  const [callAccepted, setCallAccepted] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [callInterval, setCallInterval] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [friendsIds, setFriendsIds] = useState([]);        // raw IDs from fetchMe
  const [searchFriends, setSearchFriends] = useState([]);  // friend‐info for display
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const audioRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

const filteredUsers = users.filter((usr) => {
  // Check if participants[1] exists
  const participant = usr.participants[1];
  if (!participant) return false; // Return false if participant[1] is undefined

  const firstName = participant.firstName || "";
  const lastName = participant.lastName || "";
  const fullName = (firstName + " " + lastName).toLowerCase();
  return fullName.includes(searchTerm.toLowerCase());
});

useEffect(() => {
  // If there’s a non‐empty search term AND no lobby matches, fetch friends
  if (searchTerm && filteredUsers.length === 0 && friendsIds.length) {
    getUsersInfoChat(friendsIds).then((allFriends) => {
      const lower = searchTerm.toLowerCase();
      setSearchFriends(
        allFriends
          .filter(u =>
            `${u.firstName} ${u.lastName}`.toLowerCase().includes(lower)
          )
          .sort((a, b) =>
            a.firstName.localeCompare(b.firstName) ||
            a.lastName.localeCompare(b.lastName)
          )
      );
    });
    return;
  }

  // Otherwise, if we previously had searchFriends, clear them exactly once
  if (searchFriends.length > 0) {
    setSearchFriends([]);
  }
}, [searchTerm, filteredUsers, friendsIds, searchFriends]);



const handleFriendClick = async (friend) => {
  if (!authUser) {
    console.error("User not authenticated");
    return;
  }
  try {
    const { chatLobbyId } = await createChatLobbyRequest(authUser._id, friend._id);
    window.location.href = `/profile/chat`;
  } catch (error) {
    console.error("Error starting chat", error);
  }
};




  // Handler for the message textarea key down
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Prevent new line and send message on Enter
      e.preventDefault();
      handleMessageSubmit(e);
    }
    // Shift+Enter will naturally create a new line in a textarea
  };
  
  const deleteChatForUser = async (chatLobbyId, currentUserId) => {
    try {
      const response = await axios.post(
        `${BASE_ENDPOINT}/auth/delete-chat-for-user`,
        { 
          chatLobbyId, 
          userId: currentUserId // Pass the current user id explicitly
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        }
      );
      console.log("Delete response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting chat for user:", error);
      throw error;
    }
  };
  

  const handleDeleteChat = async (chatLobbyId, currentUserId) => {
    try {
      const data = await deleteChatForUser(chatLobbyId, currentUserId);
      setCredentials((prev) => ({ ...prev, room: null }));
  
      // Refresh page after successful deletion
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete chat lobby for user", error);
    }
  };
  
  

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Helper: Choose a supported MIME type for recording
  const getSupportedMimeType = () => {
    const mimeTypes = [
      "audio/ogg; codecs=opus",
      "audio/webm; codecs=opus",
      "audio/webm",
    ];
    for (let type of mimeTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return "";
  };

  const deleteMessageSocket = (messageId, deleteType,chatLobbyId,userId,time) => {
    if (socket) {
      socket.emit("deleteMessage", { messageId, deleteType,chatLobbyId,userId,time }, (err) => {
        if (!err) {
          // Remove message from state immediately after deletion
          setChats((prevChats) => prevChats.filter(msg => msg.id !== messageId));
        } else {
          console.error("Error deleting message via socket:", err);
        }
      });
    }
  };
  
  

  // Start capturing audio and sending chunks via socket.
  const startAudioCall = () => {
    const constraints = { audio: true };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((mediaStream) => {
        const mimeType = getSupportedMimeType();
        if (!mimeType) {
          console.error("No supported MIME type for MediaRecorder.");
          return;
        }
        const recorder = new MediaRecorder(mediaStream, { mimeType });
        recorder.onstart = function () {
          this.chunks = [];
        };
        recorder.ondataavailable = function (e) {
          this.chunks.push(e.data);
        };
        recorder.onstop = function () {
          const blob = new Blob(this.chunks, { type: mimeType });
          if (socket && credentials.room) {
            socket.emit("audioCall", { chatLobbyId: credentials.room, blob });
          }
        };
        recorder.start();
        // Every second, stop and restart to send chunks.
        const interval = setInterval(() => {
          if (recorder.state === "recording") {
            recorder.stop();
            recorder.start();
          }
        }, 1000);
        setCallInterval(interval);
        setMediaRecorder(recorder);
        setIsCalling(true);
      })
      .catch((error) => {
        console.error("Error starting audio call", error);
      });
  };

  // End call: stop recording, timer, and notify the other user.
  const endCall = () => {
    if (callInterval) {
      clearInterval(callInterval);
      setCallInterval(null);
    }
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    setIsCalling(false);
    setCallAccepted(false);
    setCallTime(0);
    setShowCallModal(false);
    setIncomingCall(null);
    if (socket && credentials.room) {
      socket.emit("callEnded", credentials.room);
    }
  };

  // Caller initiates the call.
  const handleCallPress = () => {
    if (socket && credentials.room) {
      setCallRole("caller");
      setCallAccepted(false);
      socket.emit("initializeAudioCall", credentials.room);
    }
    setShowCallModal(true);
  };

  // Receiver accepts the incoming call.
  const handleAcceptCall = () => {
    if (socket && credentials.room) {
      socket.emit("callReceived", credentials.room);
    }
    setCallAccepted(true);
    // Start the call timer.
    setCallTime(0);
    const timer = setInterval(() => {
      setCallTime((prev) => prev + 1);
    }, 1000);
    setTimerInterval(timer);
    // Start sending audio if not already.
    if (!isCalling) {
      startAudioCall();
    }
  };

  // Receiver rejects the call.
  const handleRejectCall = () => {
    if (socket && credentials.room) {
      socket.emit("callNotReceived", credentials.room);
    }
    setShowCallModal(false);
    setIncomingCall(null);
  };

  // Fetch authenticated user info.
  useEffect(() => {
    const getMe = async () => {
      try {
        const me = await fetchMe();
        if (me && me.username) {
          setAuthUser(me);
          setCredentials((prev) => ({
            ...prev,
            name: me.username,
            userId: me._id,
          }));
          setFriendsIds(me.mytribers || []);
        }
      } catch (error) {
        console.error("Error fetching authenticated user:", error);
      }
    };
    getMe();
  }, []);

  // Fetch list of users.
  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await getChatLobby();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
    getUsers();
  }, []);
  

  const downloadFile = async (url, fileName) => {
    try {
      const finalUrl = url.includes("firebasestorage.googleapis.com")
        ? `${BASE_ENDPOINT}/proxy-download?fileUrl=${encodeURIComponent(url)}`
        : url;
      const response = await fetch(finalUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  // Fetch chat history when a chat lobby is set.
  useEffect(() => {
    if (credentials.room) {
      const fetchChatMessages = async () => {
        try {
          setIsLoading(true);
          const res = await axios.get(
            `${BASE_ENDPOINT}/auth/chat-messages/${credentials.room}?userId=${credentials.userId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access-token")}`,
              },
            }
          );
          const msgs = res.data.map((msg) => ({
            id: msg._id,
            text: msg.message,
            from: msg.sender.username || msg.sender,
            senderId: msg.sender._id || msg.sender,
            time: moment(msg.sentAt).format("hh:mm"),
            timestamp: msg.sentAt,
            type: msg.type || "text",
            seen: msg.seen,
            url: msg.fileUrl,
            isImage: msg.isImage,
            isVideo:
              msg.isVideo ||
              (msg.fileUrl && /\.(mp4|webm|ogg)$/i.test(msg.fileUrl)),
          }));
          setChats(msgs);
          setIsLoading(false);
          if (selectedUser && selectedUser._id) {
            setUnseenCount((prev) => ({ ...prev, [selectedUser._id]: 0 }));
          }
         // tell the server you’ve seen _their_ messages
          await axios.patch(
            `${BASE_ENDPOINT}/messages/${credentials.room}/mark-seen`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access-token")}`,
              },
            }
          );

          // locally only mark messages _not_ from you as seen
          setChats(prevChats =>
            prevChats.map(msg =>
              // msg.senderId is the sender of that message:
              msg.senderId !== authUser._id
                ? { ...msg, seen: true }
                : msg
            )
          );

        } catch (error) {
          console.error("Error fetching chat messages", error);
          setIsLoading(false);
        }
      };
      fetchChatMessages();
    }
  }, [credentials.room, selectedUser]);

  // Auto-scroll chat content.
  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [chats]);

  // Socket.IO connection and event handlers.
  useEffect(() => {
    if (authUser && credentials.room) {
      const socketConnection = io(SOCKET_ENDPOINT, { query: credentials });
      setSocket(socketConnection);

      socketConnection.on("connect", () => {
        socketConnection.emit("join", credentials, (err) => {
          if (err) alert(err);
        });
      });

      socketConnection.on("newMessage", (message) => {
        const formattedTime = moment(message.sentAt).format("hh:mm");
        setChats((prevChats) => [
          ...prevChats,
          {
            id: message._id,
            text: message.text,
            from: message.from,
            senderId: message.senderId,
            time: formattedTime,
            seen: message.seen,
            timestamp: message.sentAt,
            type: "text",
          },
        ]);
        if (
          authUser &&
          message.senderId &&
          message.senderId !== authUser._id
        ) {
          if (!selectedUser || selectedUser._id !== message.senderId) {
            setUnseenCount((prev) => ({
              ...prev,
              [message.senderId]: (prev[message.senderId] || 0) + 1,
            }));
          }
        }
      });

      socketConnection.on("newFileMessage", (message) => {
        const formattedTime = moment(message.sentAt).format("hh:mm");
        setChats((prevChats) => [
          ...prevChats,
          {
            id: message._id,
            text: "",
            from: message.from,
            senderId: message.senderId,
            time: formattedTime,
            seen: message.seen,
            timestamp: message.sentAt,
            type: "file",
            url: message.url,
            isImage: message.isImage,
            isVideo:
              message.isVideo ||
              (message.url && /\.(mp4|webm|ogg)$/i.test(message.url)),
          },
        ]);
        if (
          authUser &&
          message.senderId &&
          message.senderId !== authUser._id
        ) {
          if (!selectedUser || selectedUser._id !== message.senderId) {
            setUnseenCount((prev) => ({
              ...prev,
              [message.senderId]: (prev[message.senderId] || 0) + 1,
            }));
          }
        }
      });

      

      socketConnection.on("messageDeleted", (data) => {
        setChats((prevChats) => prevChats.filter(msg => msg.id !== data.messageId));
      });

      socketConnection.on('lobbyUpdated', ({ chatLobbyId, lastmsg, lastUpdated }) => {
        setUsers(prev =>
          prev
            .map(usr =>
              usr.chatLobbyId === chatLobbyId
                ? { ...usr, lastmsg, lastUpdated }
                : usr
            )
            .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
        );
      });

      socketConnection.on("messageUpdated", ({ seen }) => {
        setChats((prev) => {
          if (prev.length === 0) return prev;
          const next = [...prev];
          const last = next[next.length - 1];
      
          // only flip seen on your own outgoing last message
          if (last.from === credentials.name) {
            last.seen = seen;
          }
          return next;
        });
      });
      
      

      // Call events.
      socketConnection.on("incomingCall", (caller) => {
        if (!isCalling) {
          setIncomingCall(caller);
          setCallRole("receiver");
          setShowCallModal(true);
        } else {
          socketConnection.emit("userBusy", credentials.room);
        }
      });

      socketConnection.on("notifyCallReceived", () => {
        if (callRole === "caller" && !callAccepted) {
          setCallAccepted(true);
          setCallTime(0);
          const timer = setInterval(() => {
            setCallTime((prev) => prev + 1);
          }, 1000);
          setTimerInterval(timer);
        }
        if (!isCalling) {
          startAudioCall();
        }
      });

      socketConnection.on("onAudioCall", (arrayBuffer) => {
        const blob = new Blob([arrayBuffer], { type: getSupportedMimeType() });
        if (audioRef.current) {
          audioRef.current.src = window.URL.createObjectURL(blob);
          audioRef.current
            .play()
            .catch((err) => console.error("Error playing audio", err));
        }
      });

      socketConnection.on("callEnded", () => {
        endCall();
      });

      socketConnection.on("callNotReceived", () => {
        setShowCallModal(false);
        setIsCalling(false);
      });

      socketConnection.on("userBusy", () => {
        alert("User busy. Try again later.");
        setShowCallModal(false);
        setIsCalling(false);
      });

      return () => {
        socketConnection.disconnect();
      };
    }
  }, [authUser, credentials.room, selectedUser, isCalling, callRole, callAccepted]);

  // whenever chats change, auto-emit messageSeen for any incoming messages you haven’t seen yet
useEffect(() => {
  if (!socket || !credentials.room) return;
  chats.forEach((msg) => {
    if (msg.from !== credentials.name && !msg.seen) {
      socket.emit("messageSeen", {
        messageId: msg.id,
        room: credentials.room,
        readerId: authUser._id
      });
    }
  });
}, [chats, socket, credentials.room, authUser]);


  // When a user is clicked in the sidebar, create or fetch a chat lobby.
  const handleUserClick = async (recipient) => {
    console.log(recipient);
    setSelectedUser(recipient);
    try {
      const res = await axios.post(
        `${BASE_ENDPOINT}/auth/chat-lobby`,
        { userId1: authUser._id, userId2: recipient.participants[1] },
      );
      const chatLobbyId = res.data.chatLobbyId;
      setCredentials((prev) => ({ ...prev, room: chatLobbyId }));
      setChats([]);
      setUnseenCount((prev) => ({ ...prev, [recipient._id]: 0 }));
    } catch (error) {
      console.error("Error creating/fetching chat lobby", error);
    }
  };

  // Send text messages.
  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && socket) {
      socket.emit(
        "createMessage",
        { text: input, sender: authUser._id, room: credentials.room },
        () => {
          setInput("");
        }
      );
    }
  };
  const hasLobbies = filteredUsers.length > 0;

  const sortedLobbies = hasLobbies
  ? [...filteredUsers].sort(
      (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)
    )
  : [];
const displayList = hasLobbies ? sortedLobbies : searchFriends;

  // File upload via jQuery AJAX.
  const uploadFile = (fileEl, isPrivate) => {
    const formData = new FormData();
    formData.append("file", fileEl.files[0]);

    $.ajax({
      url: `${BASE_ENDPOINT}/uploadmsg`,
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      xhr: function () {
        const xhr = new window.XMLHttpRequest();
        if (!isPrivate) {
          $("#upload-progress-bar").removeClass("progress-hide");
        } else {
          $("#private-upload-progress-bar").removeClass("private-progress-hide");
          $("#modal-close-button").attr("disabled", "disabled");
        }
        xhr.upload.addEventListener("progress", function (e) {
          if (e.lengthComputable) {
            const percent = (e.loaded / e.total) * 100;
            const width = "width:" + percent + "%";
            if (!isPrivate) {
              $("#upload-progress-bar-inner")
                .attr("style", width)
                .html(percent.toFixed(2) + " %");
            } else {
              $("#private-upload-progress-bar-inner")
                .attr("style", width)
                .html(percent.toFixed(2) + " %");
            }
          }
        });
        return xhr;
      },
      success: function (fileData) {
        console.log("Upload Complete", fileData);
        $("#upload-progress-bar").addClass("progress-hide");
        if (socket) {
          socket.emit("newFileMessage", fileData);
        }
      },
      error: function (err, textStatus, errorThrown) {
        console.error("Error uploading file:", err, textStatus, errorThrown);
      },
      complete: function () {
        $("#upload-progress-bar").addClass("progress-hide");
        $("#private-upload-progress-bar").addClass("private-progress-hide");
      },
    });
  };

  // Bind file input events.
  useEffect(() => {
    if (authUser) {
      $("#input-file").on("change", function () {
        const fileEl = document.getElementById("input-file");
        uploadFile(fileEl, false);
      });
      $("#private-send-file").on("change", function () {
        const fileEl = document.getElementById("private-send-file");
        uploadFile(fileEl, true);
      });
      window.upload_file = () => {
        $("#input-file").click();
      };
      window.upload_private_file = () => {
        $("#private-send-file").click();
      };

      return () => {
        $("#input-file").off("change");
        $("#private-send-file").off("change");
      };
    }
  }, [authUser, socket]);

  const renderMessage = (chat, index, isLast) => {
    // Use chat.timestamp for deletion timing
    const canDelete =
      chat.from === credentials.name &&
      new Date() - new Date(chat.timestamp) < 7 * 60 * 1000;
  
    // Show the "Seen" indicator only for the last message sent by the current user.
    const showSeen = isLast && chat.from === credentials.name;
  
    // Define a common responsive style for images and iframes.
    const commonResponsiveStyle = {
      maxWidth: "200px",
      width: "100%",
      display: "block"
    };
    const commonimgResponsiveStyle = {
      maxWidth: "230px",
      width: "100%",
      maxHeight: "230px",
      height: "100%",
      display: "block"
    };
    const commonvideoResponsiveStyle = {
      width: "100%",
      maxWidth: "300px",
      height: "auto",
      display: "block"
    };
    
    if (chat.type === "text") {
      return (
        <div
          key={index}
          className={`chat-item chat-${
            chat.from === credentials.name ? "right" : "left"
          }`}
          style={{
            display: "flex",
            alignItems: "flex-start",
            marginBottom: "10px",
            flexDirection: chat.from === credentials.name ? "row-reverse" : "row"
          }}
        >

          <div className="chat-details">
            <div
              className="message-container"
              style={{ position: "relative", display: "inline-block" }}
            >
              <div
                className="chat-text"
                style={{
                  padding: "8px 12px",
                  borderRadius: "16px",
                }}
              >
                {chat.text}
              </div>
            </div>
            <div
              className="chat-time"
              style={{ fontSize: "0.8em", color: "#666", marginTop: "4px" }}
            >
              {chat.time}
            </div>
          
            {showSeen && (
              <div style={{ fontSize: "0.7em", color: "#999" }}>
                {chat.seen ? "Seen" : ""}
              </div>
            )}
            {canDelete && (
              <div
                className="message-options"
                style={{
                  marginTop: "5px",
                  padding: "2px",
                  borderRadius: "4px"
                }}
              >
                <i
                  className="mdi mdi-delete"
                  style={{ cursor: "pointer", fontSize: "1.2em" }}
                  onClick={() => deleteMessageSocket(chat.id, "forEveryone",credentials.room,credentials.userId,chat.timestamp)}
                  title="Delete for Everyone"
                ></i>
              </div>
            )}
          </div>
        </div>
      );
    } else if (chat.type === "file") {
      const trimmedUrl = chat.url.trim();
      const fileUrl = /^https?:\/\//.test(trimmedUrl)
        ? trimmedUrl
        : `${BASE_ENDPOINT}/uploads/${trimmedUrl}`;
      return (
        <div
          key={index}
          className={`chat-item chat-${
            chat.from === credentials.name ? "right" : "left"
          }`}
          style={{
            display: "flex",
            alignItems: "flex-start",
            marginBottom: "10px",
            flexDirection: chat.from === credentials.name ? "row-reverse" : "row"
          }}
        >

          <div className="chat-details">
            <div
              className="message-container"
              style={{ position: "relative", display: "inline-block" }}
            >
              {chat.isImage ? (
                <img src={fileUrl} alt="uploaded" style={commonimgResponsiveStyle} />
              ) : chat.isVideo ? (
                <video controls style={commonvideoResponsiveStyle}>
                  <source src={fileUrl} type="video/mp4"/>
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div
                  style={{
                    ...commonResponsiveStyle,
                    padding: "8px",
                    textAlign: "center"
                  }}
                >
                  <i className="mdi mdi-file" style={{ fontSize: "2em" }}></i>
                </div>
              )}
            </div>
            <div
              className="chat-time"
              style={{ fontSize: "0.8em", color: "#666", marginTop: "4px" }}
            >
              {chat.time}
            </div>
         
            {showSeen && (
              <div style={{ fontSize: "0.7em", color: "#999" }}>
                {chat.seen ? "Seen" : ""}
              </div>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "5px"
              }}
            >
              {canDelete && (
                <div
                  className="message-options"
                  style={{
                    display: "flex",
                    padding: "2px",
                    borderRadius: "4px",
                    marginRight: "10px" // space between icons
                  }}
                >
                  <i
                    className="mdi mdi-delete"
                    style={{ cursor: "pointer", fontSize: "1.2em" }}
                    onClick={() => deleteMessageSocket(chat.id, "forEveryone",credentials.room,credentials.userId,chat.timestamp)}
                    title="Delete for Everyone"
                  ></i>
                </div>
              )}
              <div
                className="download-icon"
                style={{
                  display: "flex",
                  padding: "2px",
                  borderRadius: "4px"
                }}
              >
                <i
                  className="mdi mdi-download"
                  style={{ cursor: "pointer", fontSize: "1.2em" }}
                  onClick={() =>
                    downloadFile(
                      fileUrl,
                      chat.isImage
                        ? `Download-Image-${moment().format("YYYYMMDD-HHmmss")}.png`
                        : chat.isVideo
                        ? `Download-Video-${moment().format("YYYYMMDD-HHmmss")}.mp4`
                        : `Download-File-${moment().format("YYYYMMDD-HHmmss")}`
                    )
                  }
                  title="Download File"
                ></i>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };
  
  return (
    <>
      <div id="app">
  <div className="main-wrapper main-wrapper-1">
    <div className="navbar-bg"></div>
    <div className="main-content">
      <section className="section">
        <div className="section-body">
          <div className="row">
            {/* Left Sidebar: People List */}
            {(!isMobile || (isMobile && !selectedUser)) && (
  <div className="col-lg-3">
    <div className="card">
      <div className="body">
        <div id="plist" className="people-list">
          <div className="chat-search">
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div
            className="m-b-20"
            style={{
              overflowY: "auto",
              maxHeight: "calc(100vh - 150px)",
            }}
          >
             {displayList.length > 0 && (
            <ul className="chat-list list-unstyled m-b-0">
              {displayList.map((item, idx) => {
                if (hasLobbies) {
                  // existing chat lobby entry
                  const usr = item;
                  const count = unseenCount[usr._id] || 0;
                  const otherUser =
                    usr.participants[0]._id === credentials.userId
                      ? usr.participants[1]
                      : usr.participants[0];
                  const firstName = otherUser.firstName || "N/A";
                  const lastName = otherUser.lastName || "N/A";
                  const profilepic =
                    otherUser.profile_pic ||
                    "/assets/admin_assets/img/users/user.png";
                  return (
                    <li
                      key={usr.chatLobbyId}
                      className="clearfix"
                      onClick={() => handleUserClick(usr)}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={profilepic}
                        alt="avatar"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                        }}
                      />
                      <div className="about">
                        <div className="name">
                          {firstName} {lastName}
                          {count > 0 && (
                            <span
                              style={{
                                backgroundColor: "red",
                                color: "white",
                                borderRadius: "50%",
                                padding: "2px 6px",
                                fontSize: "0.7em",
                                marginLeft: "5px",
                              }}
                            >
                              {count}
                            </span>
                          )}
                        </div>
                        {usr.lastmsg && (
                          <div
                            style={{
                              fontSize: "0.8em",
                              color: "gray",
                              marginTop: "2px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: "150px",
                            }}
                          >
                            {usr.lastmsg}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                } else {
                  // fallback to friends list
                  const friend = item;
                  return (
                    <li
                      key={friend._id}
                      className="clearfix"
                      onClick={() => handleFriendClick(friend)}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={friend.profile_pic || "/assets/admin_assets/img/users/user.png"}
                        alt="avatar"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                        }}
                      />
                      <div className="about">
                        <div className="name">
                          {friend.firstName} {friend.lastName}
                        </div>
                      </div>
                    </li>
                  );
                }
              })}
            </ul>)}
          </div>
        </div>
      </div>
    </div>
  </div>
)}

{/* Chat Box (Right Side) */}
{(isMobile && selectedUser) || (!isMobile && (selectedUser || credentials.room)) ? (
  <div className={isMobile ? "col-12" : "col-xs-12 col-sm-12 col-md-9 col-lg-9"}>
    <div className="card">
      <div className="chat">
        {/* Chat Header */}
        <div
          className="chat-header clearfix"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left: User Info */}
          <div style={{ display: "flex", alignItems: "center" }}>
            {isMobile && selectedUser && (
              <i
                className="mdi mdi-arrow-left"
                style={{
                  cursor: "pointer",
                  marginRight: "10px",
                  fontSize: "24px",
                }}
                onClick={() => setSelectedUser(null)}
                title="Back"
              ></i>
            )}
           {selectedUser && (() => {
  // Determine the other user based on credentials.userId
  const otherUser =
    selectedUser.participants[0]._id === credentials.userId
      ? selectedUser.participants[1]
      : selectedUser.participants[0];
  return (
    <a
      href={`/profile/tribers/${otherUser._id}`}
      className="chat-about"
      style={{
        display: "flex",
        alignItems: "center",
        textDecoration: "none",
        color: "inherit",
        marginLeft: "10px",
        cursor: "pointer",
      }}
    >
      <img
        src={otherUser.profile_pic || "/assets/admin_assets/img/users/user.png"}
        alt="avatar"
        style={{ width: "40px", height: "40px", borderRadius: "50%" }}
      />
      <div style={{ marginLeft: "8px" }}>
        {otherUser.firstName} {otherUser.lastName}
      </div>
    </a>
  );
})()}

            {!selectedUser && !credentials.room && (
              <div className="chat-about" style={{ marginLeft: "10px" }}>
                <div className="chat-with">Select a user to start a chat</div>
              </div>
            )}
          </div>

          {/* Right: Call & Menu Icons */}
          <div style={{ display: "flex", alignItems: "center", marginLeft: "auto" }}>
            {callRole === "caller" ? (
              isCalling ? (
                <>
                  <span style={{ marginRight: "10px" }}>Calling...</span>
                  <i
                    className="mdi mdi-phone-hangup"
                    style={{
                      fontSize: "24px",
                      cursor: "pointer",
                      color: "red",
                    }}
                    onClick={endCall}
                    title="End Call"
                  ></i>
                </>
              ) : (
                <i
                  className="mdi mdi-phone"
                  style={{
                    fontSize: "24px",
                    cursor: "pointer",
                    marginRight: "15px",
                  }}
                  onClick={handleCallPress}
                  title="Start Call"
                ></i>
              )
            ) : (
              <i
                className="mdi mdi-phone"
                style={{
                  fontSize: "24px",
                  cursor: "pointer",
                  marginRight: "15px",
                }}
                onClick={handleCallPress}
                title="Start Call"
              ></i>
            )}
            <div className="dropdown">
              <i
                className="mdi mdi-dots-vertical"
                style={{ fontSize: "24px", cursor: "pointer" }}
                data-bs-toggle="dropdown"
                aria-expanded="false"
              ></i>
              <ul className="dropdown-menu dropdown-menu-end">
              <li>
      <a
        className="dropdown-item"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleDeleteChat(credentials.room, credentials.userId);
        }}
      >
        Delete Chat
      </a>
    </li>
                <li>
                  <a className="dropdown-item" href="/profile/support">Report</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Chat Box */}
        <div
          className="chat-box"
          id="mychatbox"
          style={{
            display: "flex",
            flexDirection: "column",
            maxHeight: "calc(100vh - 150px)",
          }}
        >
          <div
            className="card-body chat-content"
            ref={chatContentRef}
            style={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              wordBreak: "break-word", // Ensures long messages wrap properly
            }}
          >
            {isLoading ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                Loading messages...
              </div>
            ) : (
              chats.map((chat, index) =>
                renderMessage(chat, index, index === chats.length - 1)
              )
            )}
          </div>

          {/* Chat Input Form */}
         {/* Chat Input Form (conditionally rendered) */}
{!selectedUser?.blockedBy?.includes(authUser._id) && !authUser.blockedTribes?.includes(selectedUser._id) && (
  <div className="card-footer chat-form">
    <form
      id="chat-form"
      onSubmit={handleMessageSubmit}
      style={{ display: "flex", alignItems: "center" }}
    >
      <textarea
        className="form-control"
        placeholder="Type a message"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          resize: "none",
          overflow: "hidden",
          height: "50px",
          flex: 1, // Allows input to take full width
        }}
      ></textarea>
      <button
        className="btn btn-primary btn-send"
        type="submit"
        style={{ marginLeft: "5px" }}
      >
        <i className="far fa-paper-plane"></i>
      </button>
      <button
        type="button"
        className="btn btn-primary btn-file"
        onClick={() => document.getElementById("input-file").click()}
        style={{ marginLeft: "5px" }}
      >
        <i className="mdi mdi-paperclip"></i>
      </button>
      <input type="file" id="input-file" style={{ display: "none" }} accept="*/*" />
    </form>
  </div>
)}

        </div>
      </div>
    </div>
  </div>
) : null}



            {/* End Chat Box */}
          </div>
        </div>
      </section>
    </div>
  </div>
</div>

      {/* Hidden audio element */}
      <audio ref={audioRef} autoPlay style={{ display: "none" }} />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/nicescroll/3.7.6/jquery.nicescroll.min.js" />

      {/* Call Modal */}
      {showCallModal && (
        <>
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
                      Incoming call from{" "}
                      {incomingCall && incomingCall.username}
                    </h5>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                        marginTop: "15px",
                      }}
                    >
                      <button
                        className="btn btn-success"
                        onClick={handleAcceptCall}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={handleRejectCall}
                      >
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
      )}
    </>
  );
}
