import { extractYouTubeId } from "../../utils/youtube";

export default function LiveSection({ id, live }) {
  const videoId = extractYouTubeId(live?.youtubeUrl);

  if (!videoId) {
    return (
      <section id={id} className="live-section">
        <div className="live-header">
          <p className="live-pill">LIVE</p>
          <h2>{live?.title || "Live Session"}</h2>
          <p className="live-description">Live stream is currently unavailable.</p>
        </div>
      </section>
    );
  }

  const autoplay = live?.autoplay ? 1 : 0;
  const mute = live?.mute ? 1 : 0;

  return (
    <section id={id} className="live-section">
      <div className="live-header">
        <p className="live-pill">LIVE</p>
        <h2>{live?.title || "Live Session"}</h2>
        {live?.description ? <p className="live-description">{live.description}</p> : null}
      </div>
      <div className="live-player-wrap">
        <iframe
          className="live-player"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoplay}&mute=${mute}&rel=0&playsinline=1`}
          title={live?.title || "Live Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </section>
  );
}
