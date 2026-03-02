import { extractYouTubeId, toYouTubeThumbnail } from "../../utils/youtube";

function VideoCard({ video, onWatch }) {
  const thumbnail = toYouTubeThumbnail(video.youtubeUrl);
  const videoId = extractYouTubeId(video.youtubeUrl);

  return (
    <article className="card">
      {thumbnail ? (
        <img className="card-image" src={thumbnail} alt={video.title || "Video thumbnail"} loading="lazy" />
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
          aria-label={`Watch ${video.title}`}
        >
          Watch
        </button>
      </div>
    </article>
  );
}

export default function VideoRow({ title, description, videos, onWatch }) {
  return (
    <section className="row">
      <div className="section-heading">
        <h2>{title}</h2>
        {description ? <p className="row-description">{description}</p> : null}
      </div>
      <div className="cards">
        {(videos || []).map((video) => (
          <VideoCard key={video.id} video={video} onWatch={onWatch} />
        ))}
      </div>
    </section>
  );
}
