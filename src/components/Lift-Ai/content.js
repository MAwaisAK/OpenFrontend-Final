// components/MyTribes.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "@/styles/liftai.css";
import { fetchMe } from "@/app/api";

const MyTribes = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Welcome to Lift-AI your Business Analyst assistant. How may I help you?",
    },
  ]);
  const [input, setInput] = useState("");
  const [tokens, setTokens] = useState(0);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // on mount, fetch user ID and initial token count
  useEffect(() => {
    (async () => {
      try {
        const u = await fetchMe();
        setUserId(u.id || u._id);
        setTokens(u.tokens || 0);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    })();
  }, []);

  // scroll down when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const text = input.trim();

    // 1) add user message
    setMessages((m) => [...m, { sender: "user", text }]);
    setInput("");

    // 2) add temporary bot placeholder
    setMessages((m) => [...m, { sender: "bot", text: "Thinking…" }]);
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/lift-ai/chat`,
        { message: text, userId }
      );

      // try to extract download URL
      let downloadUrl = data.downloadUrl;
      if (!downloadUrl && data.reply) {
        try {
          const parsed = JSON.parse(data.reply);
          if (parsed.downloadUrl) downloadUrl = parsed.downloadUrl;
        } catch {}
      }

      // replace the "Thinking…" placeholder with either a download link or reply text
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = downloadUrl
          ? { sender: "bot", downloadUrl }
          : { sender: "bot", text: data.reply };
        return copy;
      });

      // **new**: re-fetch the user's token count from the server
      try {
        const u = await fetchMe();
        setTokens(u.tokens || 0);
      } catch (err) {
        console.error("Error refreshing tokens:", err);
      }
    } catch (e) {
      // on error, replace placeholder with error message
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          sender: "bot",
          text: "Error—please try again.",
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (html) => {
    let text = html.replace(/<br\s*\/?>/gi, "\n");
    text = text.replace(/<b>(.*?)<\/b>/gi, "**$1**");
    text = text.replace(/<[^>]+>/g, "");
    navigator.clipboard.writeText(text);
  };

  const [isSpeaking, setIsSpeaking] = useState(false);
  const handleSpeak = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const lastBotMsg = [...messages]
      .reverse()
      .find((m) => m.sender === "bot");
    if (lastBotMsg) {
      const temp = document.createElement("div");
      temp.innerHTML = lastBotMsg.text || "";
      const utterance = new SpeechSynthesisUtterance(
        temp.textContent || ""
      );
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <>
      <div className="tokens-display">
        <a href="/profile/buy-tokens">
          <img
            src="/assets/img/O.png"
            alt="Tokens Icon"
            className="tokens-icon"
          />
          <span style={{ color: tokens < 500 ? "red" : "inherit" }}>
            <b>{tokens}</b>
          </span>
        </a>
        {tokens < 500 && (
          <p className="low-token-warning">
            ⚠️ Low tokens! <a href="/profile/buy-tokens">Buy more</a> to
            continue using Lift-AI.
          </p>
        )}
      </div>

      <div id="chat" className="--dark-theme chat-container">
        <div className="chat__conversation-board">
          {messages.map((msg, idx) => {
            const inlineMatch =
              typeof msg.text === "string" &&
              msg.text.match(
                /\/downloads\/[^\s"']+\.(pdf|docx)/
              );
            const path = msg.downloadUrl || inlineMatch?.[0];
            const downloadLink = path
              ? `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}${path}`
              : null;
            const fileName = path?.split("/").pop();

            return (
              <div
                key={idx}
                className={`chat__conversation-board__message-container ${
                  msg.sender === "user" ? "reversed" : ""
                }`}
              >
                <div className="chat__conversation-board__message__person">
                  <div className="chat__conversation-board__message__person__avatar">
                    <img
                      src={
                        msg.sender === "user"
                          ? "/assets/img/o_2.png"
                          : "/assets/img/O.png"
                      }
                      className="sender-img"
                      alt="Avatar"
                    />
                  </div>
                  <span className="chat__conversation-board__message__person__nickname">
                    {msg.sender === "user" ? "You" : "Lift AI"}
                  </span>
                </div>
                <div className="chat__conversation-board__message__context d-flex align-items-center">
                  <div className="chat__conversation-board__message__bubble">
                    {downloadLink ? (
                      <a
                        className="download-btn"
                        href={downloadLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={fileName}
                        style={{
                          textDecoration: "none",
                        }}
                      >
                        📄 Download{" "}
                        <i
                          className="mdi mdi-download"
                          style={{ fontSize: "18px" }}
                        />
                      </a>
                    ) : (
                      <span
                        dangerouslySetInnerHTML={{ __html: msg.text }}
                      />
                    )}
                  </div>
                  <button
                    className="btn btn-link copy-btn ms-2"
                    onClick={() => handleCopy(msg.text)}
                  >
                    <i className="fa fa-copy" />
                  </button>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        <div className="chat__conversation-panel">
          <div className="chat__conversation-panel__container d-flex align-items-center w-100">
            <input
              className="chat__conversation-panel__input panel-item flex-grow-1"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              className="btn btn-primary ms-2"
              onClick={handleSend}
              disabled={loading}
            >
              <i className="fa fa-paper-plane" />
            </button>
            <button
              className="btn btn-primary mt-2"
              onClick={handleSpeak}
            >
              <i
                className={
                  isSpeaking ? "mdi mdi-stop-circle" : "mdi mdi-microphone"
                }
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyTribes;
