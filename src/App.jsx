import { useEffect, useState } from "react";
import { extractYouTubeId, toYouTubeThumbnail } from "./utils/youtube";

const journeyTracks = [
  {
    id: "quran",
    title: "Quran Reflection",
    description: "Short reflections for daily recitation and practical application.",
    cta: "Start Reflection"
  },
  {
    id: "character",
    title: "Character Building",
    description: "Actionable reminders to improve adab, discipline, and sincerity.",
    cta: "Build Habits"
  },
  {
    id: "community",
    title: "Family & Community",
    description: "Content streams for homes, masjid circles, and youth sessions.",
    cta: "Join Sessions"
  }
];

const highlights = [
  { id: "days", label: "Ramadan Program", value: "30 Days" },
  { id: "videos", label: "Active Sections", value: "Live + Library" },
  { id: "format", label: "Learning Format", value: "Daily Bayan" }
];

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
      <div className="section-heading">
        <h2>{title}</h2>
      </div>
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
        <h2>{live.title || "Live Bayan"}</h2>
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
    badge: "Ramadan 2026",
    title: "A Guided Journey Through Ramadan",
    description:
      "A focused, family-friendly Islamic learning space for reflections, live bayan, and daily growth."
  };

  return (
    <div className="page">
      <header className="top-nav">
        <div className="brand-wrap">
          <div className="brand">DAILY BAYAN</div>
          <p className="brand-subtitle">Ramadan Companion</p>
        </div>
        <nav>
          <a href="#journey">Journey</a>
          <a href="#live">Live</a>
          <a href="#library">Library</a>
          <a href="#subscribe">Subscribe</a>
        </nav>
      </header>

      <section className="hero">
        <p className="badge">{hero.badge}</p>
        <h1>{hero.title}</h1>
        <p className="hero-copy">{hero.description}</p>
        <p className="hero-verse">Bismillah ir-Rahman ir-Raheem</p>
        <div className="hero-actions">
          <a className="primary hero-link" href="#live">
            Watch Live
          </a>
          <a className="secondary hero-link" href="#library">
            Open Library
          </a>
        </div>
      </section>

      <main id="library">
        <section id="journey" className="journey-grid">
          {journeyTracks.map((track) => (
            <article key={track.id} className="journey-card">
              <h3>{track.title}</h3>
              <p>{track.description}</p>
              <button type="button">{track.cta}</button>
            </article>
          ))}
        </section>

        <section className="highlight-strip">
          {highlights.map((item) => (
            <div key={item.id} className="highlight-item">
              <p className="highlight-value">{item.value}</p>
              <p className="highlight-label">{item.label}</p>
            </div>
          ))}
        </section>

        {error && <p className="status error">{error}</p>}
        {!error && !videoData && <p className="status">Loading videos...</p>}
        <div id="live">{!error && videoData?.live && <LiveSection live={videoData.live} />}</div>
        {!error &&
          videoData?.sections?.map((section) => (
            <VideoRow
              key={section.id}
              title={section.title}
              videos={section.videos || []}
              onWatch={setActiveVideo}
            />
          ))}

        <section id="subscribe" className="subscribe-panel">
          <h2>Stay Updated Throughout Ramadan</h2>
          <p>Receive daily reminders and newly added bayan videos.</p>
          <div className="subscribe-actions">
            <input type="email" placeholder="Enter your email" aria-label="Email address" />
            <button type="button">Notify Me</button>
          </div>
        </section>
      </main>

      <footer className="footer">Edit `public/videos.json` to update live and video sections.</footer>

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
