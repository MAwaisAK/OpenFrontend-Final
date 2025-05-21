"use client";
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { fetchMe } from "../../app/api"; // Adjust paths as needed
import moment from "moment";
import $ from "jquery";
import "../../styles/admin_assets/css/app.min.css";
import "../../styles/admin_assets/css/components.css";
import Script from "next/script";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";


const BASE_ENDPOINT = process.env.NEXT_PUBLIC_BASE_ENDPOINT;
const SOCKET_ENDPOINT =
  process.env.NEXT_PUBLIC_BASE_ENDPOINT_SOCKET;
// Date separator component
const DateSeparator = ({ label }) => (
  <div style={{ textAlign: 'center', margin: '10px 0' }}>
    <span
      style={{
        background: '#e0e0e0',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '0.8em',
        color: '#555',
      }}
    >
      {label}
    </span>
  </div>
);

// Get human-friendly date
const getDateLabel = (timestamp) => {
  const msgDate = moment(timestamp);
  if (msgDate.isSame(moment(), 'day')) return 'Today';
  if (msgDate.isSame(moment().subtract(1, 'day'), 'day')) return 'Yesterday';
  return msgDate.format('MMMM D, YYYY');
};

function getFilenameFromUrl(url) {
  try {
    // decodeURI so “%20” → spaces etc.
    const pathname = new URL(url).pathname;
    const raw = decodeURIComponent(pathname.split('/').pop());
    return raw;   // e.g. "1747789783494-…-Sid Meier's Civilization 6 [FitGirl Repack].torrent"
  } catch {
    return '';
  }
}
function makeFallbackName() {
  return `Download-File-${moment().format("YYYYMMDD-HHmmss")}`;
}


export default function ChatAppMerged() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState(null);
  const [credentials, setCredentials] = useState({
    name: "",
    room: "", // This is the tribe chat lobby ID
    userId: "",
  });
  const [tribeInfo, setTribeInfo] = useState(null); // Store tribe details: title, thumbnail, messageSettings, admins, etc.
  const [socket, setSocket] = useState(null);
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatContentRef = useRef(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const fileInputRef = useRef(null);

  const params = useParams();
  const tribeId = params?.id; // Get tribe ID from route params
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // ── New for Enlarging Images ──
  const [enlargedImageUrl, setEnlargedImageUrl] = useState(null);

  useEffect(() => {
    // Fetch authenticated user info
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
        }
      } catch (error) {
        console.error("Error fetching authenticated user:", error);
      }
    };
    getMe();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleMessageSubmit(e);
    }
  };

  const downloadFile = async (url, providedName) => {
    try {
      // pick providedName if it already has an extension, otherwise extract real:
      const realName = getFilenameFromUrl(url);
      const fileName = providedName && /\.[a-z0-9]+$/i.test(providedName)
        ? providedName
        : (realName || makeFallbackName());

      const finalUrl = url.includes("storage.googleapis.com")
        ? `${BASE_ENDPOINT}/proxy-download?fileUrl=${encodeURIComponent(url)}`
        : url;

      const response = await fetch(finalUrl);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

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


  useEffect(() => {
    if (tribeId && authUser) {
      // Fetch or create tribe chat lobby based on the tribeId
      const fetchOrCreateChatLobby = async () => {
        try {
          // Try to fetch existing tribe chat lobby along with tribe info
          const res = await axios.get(
            `${BASE_ENDPOINT}/my-tribes/tribe-lobby/${tribeId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access-token")}`,
              },
            }
          );
          if (res.data?.chatLobbyId) {
            setCredentials((prev) => ({
              ...prev,
              room: res.data.chatLobbyId,
            }));
            if (res.data.tribe) {
              setTribeInfo(res.data.tribe);
            }
          } else {
            const createRes = await axios.post(
              `${BASE_ENDPOINT}/my-tribes/tribe-lobby/${tribeId}`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("access-token")}`,
                },
              }
            );
            const chatLobbyId = createRes.data.chatLobbyId;
            setCredentials((prev) => ({
              ...prev,
              room: chatLobbyId,
            }));
            if (createRes.data.tribe) {
              setTribeInfo(createRes.data.tribe);
            }
          }
        } catch (error) {
          console.error("Error fetching/creating tribe chat lobby:", error);
        }
      };
      fetchOrCreateChatLobby();
    }
  }, [tribeId, authUser]);

  useEffect(() => {
    if (tribeInfo?.blockedUsers?.includes(authUser?._id)) {

      router.push("/profile/mytribes");
    }
  }, [tribeInfo, authUser, router]);

  // Socket.IO connection logic for tribe messages
  useEffect(() => {
    if (authUser && credentials.room) {
      // Create a new socket connection using tribe events
      const socketConnection = io(SOCKET_ENDPOINT, { query: credentials });
      setSocket(socketConnection);

      // Use new tribe-specific events
      socketConnection.on("connect", () => {
        socketConnection.emit("join", credentials, (err) => {
        });
      });

      socketConnection.on("newTribeMessage", (message) => {
        const formattedTime = moment(message.sentAt).format("hh:mm");
        setChats((prevChats) => [
          ...prevChats,
          {
            id: message._id,
            text: message.text,
            from: message.from,
            senderId: message.senderId,
            time: formattedTime,
            senderUsername: message.senderUsername,
            seen: message.seen,
            timestamp: message.sentAt,
            type: "text",
          },
        ]);
      });

      socketConnection.on("tribeMessageDeleted", ({ messageId }) => {
        setChats(prev => prev.filter(chat => chat.id !== messageId));
      });


      socketConnection.on("tribeNewFileMessage", (message) => {
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
            senderUsername: message.senderUsername,
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

      return () => {
        socketConnection.off("newTribeMessage");
        socketConnection.off("tribeMessageDeleted");
        socketConnection.disconnect();
      };
    }
  }, [authUser, credentials.room]);


  const deleteTribeMessage = (messageId, deleteType, room, userId, timestamp) => {
    socket.emit(
      "deleteTribeMessage",
      { messageId, deleteType, room, userId, timestamp },
      (err) => {
        if (err) console.error("Delete failed:", err);
        // no local setChats here!
      }
    );
  };


  // Fetch chat history when the chat lobby is set
  useEffect(() => {
    if (credentials.room) {
      const fetchChatMessages = async () => {
        try {
          const el = chatContentRef.current;
          let previousHeight = 0;
          if (el && page > 0) previousHeight = el.scrollHeight;

          setIsLoading(true);
          const { data } = await axios.get(
            `${BASE_ENDPOINT}/my-tribes/tribe-messages/${credentials.room}?page=${page}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access-token")}`,
              },
            }
          );
          const msgs = data.messages.map((msg) => ({
            id: msg._id,
            text: msg.message,
            from: msg.sender.username || msg.sender,
            senderId: msg.sender._id || msg.sender,
            time: moment(msg.sentAt).format("hh:mm"),
            timestamp: msg.sentAt,
            senderUsername: msg.sender.username || msg.sender,
            type: msg.type || "text",
            seen: msg.seen,
            url: msg.fileUrl,
            isImage: msg.isImage,
            isVideo:
              msg.isVideo ||
              (msg.fileUrl && /\.(mp4|webm|ogg)$/i.test(msg.fileUrl)),
          }));
          setHasMore(data.hasMore);
          if (page === 0) {
            setChats(msgs);
          } else {
            setChats((prev) => [...msgs, ...prev]);
            // maintain scroll position after prepending
            setTimeout(() => {
              if (el) {
                el.scrollTop = el.scrollHeight - previousHeight;
              }
            }, 0);
          }
        } catch (err) {
          console.error("Error fetching chat messages:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchChatMessages();
    }
  }, [credentials.room, page]);
  useEffect(() => {
    const el = chatContentRef.current;
    if (!el) return;

    const onScroll = () => {
      // if we're within 20px of the top, and not already loading, fetch more
      if (el.scrollTop <= 20 && !isLoading && hasMore) {
        setPage(p => p + 1);
      }
    };

    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [isLoading]);

  // Send tribe message handler with check on messageSettings
  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (tribeInfo && tribeInfo.messageSettings === "admin") {
      if (!tribeInfo.admins.includes(authUser._id)) {
        return;
      }
    }
    if (input.trim() && socket) {
      socket.emit(
        "tribeCreateMessage",
        { text: input, sender: authUser._id, room: credentials.room },
        () => {
          setInput("");
          if (chatContentRef.current) {
            chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
          }
        }
      );
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setFilePreviewUrl(URL.createObjectURL(file));
  };

  // Called when user confirms “Send” in the preview box
  const handleSendFile = () => {
    if (!selectedFile) return;
    // … your existing upload logic …
    const fakeFileInput = { files: [selectedFile] };
    uploadFile({ files: fakeFileInput.files }, false);
    // cleanup state
    setSelectedFile(null);
    setFilePreviewUrl(null);

    // **reset the file input** so it can fire change again next time
    if (fileInputRef.current) fileInputRef.current.value = "";
  };



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
        $("#upload-progress-bar").addClass("progress-hide");
        if (socket) {
          socket.emit("tribeNewFileMessage", fileData);
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
        handleFileChange({ target: fileEl });
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

  // after your other useEffects, but before the return(...)
  useEffect(() => {
    const el = chatContentRef.current;
    // only auto-scroll on the very first load (page 0)
    if (el && page === 0) {
      el.scrollTop = el.scrollHeight;
    }
  }, [chats, page]);


  const renderMessage = (chat, index, isLast) => {
    const isAdmin = tribeInfo?.admins?.includes(authUser?._id);
    const canDelete =
      // original sender within 7min
      (chat.senderId === credentials.userId &&
        new Date() - new Date(chat.timestamp) < 7 * 60 * 1000) ||
      // OR an admin at any time
      isAdmin;

    const showSeen = isLast && chat.from === credentials.name;
    const commonResponsiveStyle = {
      maxWidth: "200px",
      width: "100%",
      display: "block",
    };
    const commonimgResponsiveStyle = {
      maxWidth: "230px",
      width: "100%",
      maxHeight: "230px",
      height: "100%",
      display: "block",
    };
    const commonvideoResponsiveStyle = {
      width: "100%",
      maxWidth: "300px",
      height: "auto",
      display: "block",
    };

    if (chat.type === "text") {
      const showUsername =
        index === 0 ||
        chats[index - 1].senderUsername !== chat.senderUsername;
      return (
        <div
          key={index}
          className={`chat-item chat-${chat.from === credentials.name ? "right" : "left"
            }`}
          style={{
            display: "flex",
            alignItems: "flex-start",
            marginBottom: "10px",
            flexDirection: chat.from === credentials.name ? "row-reverse" : "row",
          }}
        >
          <img
            src="/assets/admin_assets/img/users/user.png"
            alt="avatar"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              margin: "0 5px",
            }}
          />
          <div className="chat-details">
            <div className="message-container" style={{ position: "relative", display: "inline-block" }}>
              {showUsername && (
                <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '12px' }}>
                  {chat.senderUsername}
                </div>
              )}
              <div className="chat-text" style={{ padding: "8px 12px", borderRadius: "16px" }}>
                {chat.text}
              </div>
            </div>
            <div className="chat-time" style={{ fontSize: "0.8em", color: "#666", marginTop: "4px" }}>
              {chat.time}
            </div>
            {showSeen && (
              <div style={{ fontSize: "0.7em", color: "#999" }}>
                {chat.seen ? "Seen" : ""}
              </div>
            )}
            {canDelete && (
              <div className="message-options" style={{ marginTop: "5px", padding: "2px", borderRadius: "4px" }}>
                <i
                  className="mdi mdi-delete"
                  style={{ cursor: "pointer", fontSize: "1.2em" }}
                  onClick={() =>
                    deleteTribeMessage(
                      chat.id,                    // messageId
                      "forEveryone",              // deleteType
                      credentials.room,           // chatLobbyId
                      credentials.userId,         // userId
                      chat.timestamp              // timestamp
                    )
                  }

                  title="Delete for Everyone"
                ></i>
              </div>
            )}
          </div>
        </div>
      );
    } else if (chat.type === "file") {
      const trimmedUrl = chat.url.trim();
      const showUsername =
        index === 0 ||
        chats[index - 1].senderUsername !== chat.senderUsername;
      const fileUrl = /^https?:\/\//.test(trimmedUrl)
        ? trimmedUrl
        : `${BASE_ENDPOINT}/uploads/${trimmedUrl}`;
      return (
        <div
          key={index}
          className={`chat-item chat-${chat.from === credentials.name ? "right" : "left"}`}
          style={{
            display: "flex",
            alignItems: "flex-start",
            marginBottom: "10px",
            flexDirection: chat.from === credentials.name ? "row-reverse" : "row",
          }}
        >
          <img
            src="/assets/admin_assets/img/users/user.png"
            alt="avatar"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              margin: "0 5px",
            }}
          />
          <div className="chat-details">
            {showUsername && (
              <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '12px' }}>
                {chat.senderUsername}
              </div>
            )}
            <div className="message-container" style={{ position: "relative", display: "inline-block" }}>
              {chat.isImage ? (
                <img src={fileUrl} alt="uploaded" style={commonimgResponsiveStyle} />
              ) : chat.isVideo ? (
                <video controls style={commonvideoResponsiveStyle}>
                  <source src={fileUrl} type="video/mp4" />
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
                  {/* ↓ new file name below icon ↓ */}
                  <div style={{ fontSize: "0.8em", marginTop: "4px", wordBreak: "break-all" }}>
                    {fileUrl.split("/").pop()}
                  </div>
                </div>
              )}
            </div>
            <div className="chat-time" style={{ fontSize: "0.8em", color: "#666", marginTop: "4px" }}>
              {chat.time}
            </div>
            {showSeen && (
              <div style={{ fontSize: "0.7em", color: "#999" }}>
                {chat.seen ? "Seen" : ""}
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", marginTop: "5px" }}>
              {canDelete && (
                <div className="message-options" style={{ display: "flex", padding: "2px", borderRadius: "4px", marginRight: "10px" }}>
                  <i
                    className="mdi mdi-delete"
                    style={{ cursor: "pointer", fontSize: "1.2em" }}
                    onClick={() =>
                      deleteTribeMessage(
                        chat.id,                    // messageId
                        "forEveryone",              // deleteType
                        credentials.room,           // chatLobbyId
                        credentials.userId,         // userId
                        chat.timestamp              // timestamp
                      )
                    }

                    title="Delete for Everyone"
                  ></i>
                </div>
              )}
              <div className="download-icon" style={{ display: "flex", padding: "2px", borderRadius: "4px" }}>
                <i
                  className="mdi mdi-download"
                  style={{
                    display: "flex",
                    padding: "2px",
                    borderRadius: "4px",
                    marginRight: "10px", cursor: "pointer", fontSize: "1.2em"
                  }}
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
              <i className="mdi mdi-arrow-expand" style={{ cursor: "pointer", fontSize: "1.2em" }} onClick={() => setEnlargedImageUrl(fileUrl)} />
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Determine whether the current user can send messages based on tribe's messageSettings
  const canSendMessage =
    !selectedUser &&
    credentials.room &&
    tribeInfo &&
    (tribeInfo.messageSettings === "all" ||
      (tribeInfo.messageSettings === "admin" && tribeInfo.admins.includes(authUser?._id)));

  return (
    <>
      <div id="app">
        <div className="main-wrapper main-wrapper-1">
          <div className="navbar-bg"></div>
          <div className="main-content">
            <section className="section">
              <div className="section-body">
                <div className="row" style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                  {/* Chat Box (Right Side) */}
                  {(selectedUser || credentials.room) ? (
                    <div className={isMobile ? "col-12" : "col-xs-12 col-sm-12 col-md-9 col-lg-9"}>
                      <div className="card">
                        <div className="chat">
                          {selectedFile && (

                            <div
                              className="file-preview-box"
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                maxWidth: "90%",
                                maxHeight: "90%",
                                overflow: "auto",
                                background: "#fff",
                                padding: "1rem",
                                borderRadius: "8px",
                                boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                                zIndex: 20,
                              }}
                            >
                              {selectedFile.type.startsWith("image/") && (
                                <img
                                  src={filePreviewUrl}
                                  style={{ maxWidth: "100%", maxHeight: "60vh", objectFit: "contain", display: "block", margin: "0 auto" }}
                                />
                              )}
                              {selectedFile.type.startsWith("video/") && (
                                <video
                                  controls
                                  src={filePreviewUrl}
                                  style={{ maxWidth: "100%", maxHeight: "60vh", display: "block", margin: "0 auto" }}
                                />
                              )}
                              {!selectedFile.type.startsWith("image/") &&
                                !selectedFile.type.startsWith("video/") && (
                                  <div style={{ textAlign: "center" }}>{selectedFile.name}</div>
                                )}
                              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem", gap: "0.5rem" }}>
                                <button onClick={handleSendFile} className="btn btn-sm btn-primary">
                                  Send
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedFile(null);
                                    setFilePreviewUrl(null);
                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                  }}
                                  className="btn btn-sm btn-secondary"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                          {/* Chat Header */}
                          <div
                            className="chat-header clearfix"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            {/* Left: Display either selected user's info or tribe info */}
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
                                const otherUser =
                                  selectedUser.participants[0]._id === credentials.userId
                                    ? selectedUser.participants[1]
                                    : selectedUser.participants[0];
                                return (
                                  <>
                                    <img
                                      src={
                                        otherUser.profile_pic ||
                                        "/assets/admin_assets/img/users/user.png"
                                      }
                                      alt="avatar"
                                      style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                      }}
                                    />
                                    <div className="chat-about" style={{ marginLeft: "10px" }}>
                                      <div className="chat-with">
                                        {`${otherUser.firstName || ""} ${otherUser.lastName || ""}`}
                                      </div>
                                    </div>
                                  </>
                                );
                              })()}
                              {/* When no user is selected, show tribe info */}
                              {!selectedUser && credentials.room && tribeInfo && (
                                <Link href={`/profile/tribes/${tribeId}`} style={{ textDecoration: "none", color: "inherit" }}>
                                  <div
                                    className="chat-about"
                                    style={{
                                      marginLeft: "10px",
                                      display: "flex",
                                      alignItems: "center",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <img
                                      src={
                                        tribeInfo.thumbnail ||
                                        "/assets/admin_assets/img/default-tribe.png"
                                      }
                                      alt="Tribe Thumbnail"
                                      style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                      }}
                                    />
                                    <div style={{ marginLeft: "10px" }}>
                                      <div className="chat-with">{tribeInfo.title}</div>
                                    </div>
                                  </div>
                                </Link>
                              )}
                              {!selectedUser && !credentials.room && (
                                <div className="chat-about" style={{ marginLeft: "10px" }}>
                                  <div className="chat-with">Select a user to start a chat</div>
                                </div>
                              )}
                            </div>
                            {/* Right: Call & Menu Icons can be added here */}
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
                                position: "relative",    // ← add positioning context
                                flex: 1,
                                overflowY: "auto",
                                overflowX: "hidden",
                                wordBreak: "break-word", // Ensures long messages wrap properly
                              }}
                            >
                              {/* show banner when you've loaded at least one extra page and there’s no more to fetch */}
                              {!hasMore && page > 0 && (
                                <div
                                  style={{
                                    textAlign: "center",
                                    padding: "10px",
                                    color: "#999",
                                    fontStyle: "italic",
                                  }}
                                >
                                  — No more messages —
                                </div>
                              )}

                              {/* loading spinner/text for in-flight older-messages fetch */}
                              {isLoading && page > 0 && (
                                <div style={{ textAlign: "center", padding: "10px" }}>
                                  Loading more...
                                </div>
                              )}

                              {/* your existing chat list */}
                              {chats.map((chat, idx) => {
                                const label = getDateLabel(chat.timestamp);
                                const prevLabel =
                                  idx > 0 ? getDateLabel(chats[idx - 1].timestamp) : null;
                                return (
                                  <React.Fragment key={chat.id || idx}>
                                    {(idx === 0 || label !== prevLabel) && (
                                      <DateSeparator label={label} />
                                    )}
                                    {renderMessage(chat, idx, idx === chats.length - 1)}
                                  </React.Fragment>
                                );
                              })}
                            </div>


                            {/* Chat Input Form */}
                            {!selectedUser && credentials.room && tribeInfo ? (
                              canSendMessage ? (
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
                                        flex: 1,
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
                                    <input
                                      type="file"
                                      id="input-file"
                                      ref={fileInputRef}
                                      style={{ display: "none" }}
                                      accept="*/*"
                                    />

                                  </form>
                                </div>
                              ) : (
                                <div
                                  className="card-footer chat-form"
                                  style={{
                                    textAlign: "center",
                                    padding: "10px",
                                    color: "#999",
                                  }}
                                >
                                  {tribeInfo.messageSettings === "admin"
                                    ? "Only tribe admins can send messages."
                                    : ""}
                                </div>
                              )
                            ) : null}
                          </div>
                        </div>
                      </div>
                      {enlargedImageUrl && (
                        <div
                          className="image-lightbox-overlay"
                          onClick={() => setEnlargedImageUrl(null)}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            backgroundColor: "rgba(0, 0, 0, 0.2)",  // ← semi-transparent black
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 999,
                            cursor: "zoom-out",
                          }}
                        >
                          <img
                            src={enlargedImageUrl}
                            alt="Enlarged"
                            style={{
                              maxWidth: "90%",
                              maxHeight: "90%",
                              boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ) : null}
                  {/* End Chat Box */}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Hidden scripts for jQuery plugins */}
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/nicescroll/3.7.6/jquery.nicescroll.min.js" />
    </>
  );
}
