import { useEffect, useState } from "react";
import { extractYouTubeId, toYouTubeThumbnail } from "./utils/youtube";

function VideoCard({ video, onWatch }) {
  const thumbnail = toYouTubeThumbnail(video.youtubeUrl);
  const videoId = extractYouTubeId(video.youtubeUrl);

  return (
    <article className="card">
      {thumbnail ? (
        <img className="card-image" src={thumbnail} alt={video.title} loading="lazy" />
      ) : (
        <div className="card-image card-fallback">Invalid YouTube URL</div>
      )}
      <div className="card-overlay">
        <h3>{video.title}</h3>
        <button
          type="button"
          className="play-link"
          onClick={() => onWatch(video)}
          disabled={!videoId}
        >
          Watch
        </button>
      </div>
    </article>
  );
}

function VideoRow({ title, videos, onWatch }) {
  return (
    <section className="row">
      <h2>{title}</h2>
      <div className="cards">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} onWatch={onWatch} />
        ))}
      </div>
    </section>
  );
}

function LiveSection({ live }) {
  const liveId = extractYouTubeId(live?.youtubeUrl);
  if (!liveId) {
    return null;
  }

  return (
    <section className="live-section">
      <div className="live-header">
        <p className="live-pill">LIVE</p>
        <h2>{live.title || "Live"}</h2>
        {live.description ? <p className="live-description">{live.description}</p> : null}
      </div>
      <div className="live-player-wrap">
        <iframe
          className="live-player"
          src={`https://www.youtube.com/embed/${liveId}?autoplay=1&mute=1&rel=0&playsinline=1`}
          title={live.title || "Live Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </section>
  );
}

export default function App() {
  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    async function loadVideos() {
      try {
        const response = await fetch("/videos.json");
        if (!response.ok) {
          throw new Error(`Failed to load videos.json (${response.status})`);
        }
        const data = await response.json();
        setVideoData(data);
      } catch (err) {
        setError(err.message || "Could not load video data");
      }
    }

    loadVideos();
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeVideo ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeVideo]);

  const hero = videoData?.hero || {
    badge: "Data Driven",
    title: "YouTube Video Library",
    description: "Add YouTube links in videos.json to update this page."
  };

  return (
    <div className="page">
      <header className="top-nav">
          <div className="brand">DAILY BAYAN</div>
        <nav>
          <a href="#">Home</a>
          <a href="#">TV Shows</a>
          <a href="#">Movies</a>
          <a href="#">My List</a>
        </nav>
      </header>

      <section className="hero">
        <p className="badge">{hero.badge}</p>
        <h1>{hero.title}</h1>
        <p className="hero-copy">{hero.description}</p>
        <div className="hero-actions">
          <a className="primary hero-link" href="#content">
            Browse Videos
          </a>
        </div>
      </section>

      <main id="content">
        {error && <p className="status error">{error}</p>}
        {!error && !videoData && <p className="status">Loading videos...</p>}
        {!error && videoData?.live && <LiveSection live={videoData.live} />}
        {!error &&
          videoData?.sections?.map((section) => (
            <VideoRow
              key={section.id}
              title={section.title}
              videos={section.videos || []}
              onWatch={setActiveVideo}
            />
          ))}
      </main>

      <footer className="footer">Edit `public/videos.json` to scale your catalog.</footer>

      {activeVideo && (
        <div className="player-modal" role="dialog" aria-modal="true" aria-label={activeVideo.title}>
          <div className="player-shell">
            <button type="button" className="player-close" onClick={() => setActiveVideo(null)}>
              Close
            </button>
            <div className="player-frame-wrap">
              <iframe
                className="player-frame"
                src={`https://www.youtube.com/embed/${extractYouTubeId(activeVideo.youtubeUrl)}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
          <button
            type="button"
            className="player-backdrop"
            aria-label="Close video player"
            onClick={() => setActiveVideo(null)}
          />
        </div>
      )}
    </div>
  );
}
