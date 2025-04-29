// components/ManageNews.jsx
"use client";
import { useState, useEffect } from "react";
import { fetchAllNews, replaceNewsSection } from "@/app/api"; 
import Sidebar from "../Admin_Sidebar";
import Navbar  from "../Admin_Nav";
import Resources from "../Admin_Scripts";

export default function ManageNews() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadNews = async () => {
    setLoading(true);
    try {
      const { news } = await fetchAllNews();
      setNewsList(news);
    } catch (err) {
      console.error("Error loading news:", err);
      alert("Failed to load news.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const onReplace = async (newsId, idx) => {
    if (!confirm("Replace this section?")) return;
    try {
      await replaceNewsSection(newsId, { index: idx });
      await loadNews();
    } catch (err) {
      console.error("Error replacing news section:", err);
      alert("Replace failed.");
    }
  };

  return (
    <>
      <Resources />
      <div id="app">
        <div className="main-wrapper main-wrapper-1">
          <div className="navbar-bg" />
          <Navbar />
          <Sidebar />
          <div className="main-content">
            <section className="section">
              <div className="section-body">
                <h2 className="section-title">Manage News</h2>

                <button
                  className="btn btn-primary mb-4"
                  onClick={loadNews}
                  disabled={loading}
                >
                  {loading ? "Refreshing…" : "Refresh News"}
                </button>

                {newsList.map(doc => (
                  <div key={doc._id} className="card mb-4">
                    <div className="card-body">
                      {doc.title.map((headline, idx) => (
                        <div key={idx} className="media mb-3">
                          {doc.img[idx] && (
                            <img
                              src={doc.img[idx]}
                              alt={`Section ${idx}`}
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                marginRight: "1rem",
                              }}
                            />
                          )}
                          <div className="media-body">
                            <h5 className="mt-0">{headline}</h5>
                            <p>{doc.content[idx]}</p>
                            <a
                              href={doc.link[idx]}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Read more
                            </a>
                            <div className="mt-2">
                              <button
                                className="btn btn-warning btn-sm"
                                onClick={() => onReplace(doc._id, idx)}
                              >
                                Replace Section
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {!loading && newsList.length === 0 && <p>No news items found.</p>}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
