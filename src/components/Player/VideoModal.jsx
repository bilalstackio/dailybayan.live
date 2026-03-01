import { useEffect, useRef } from "react";
import { extractYouTubeId } from "../../utils/youtube";

function trapFocus(event, container) {
  if (event.key !== "Tab" || !container) {
    return;
  }

  const focusable = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusable.length) {
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

export default function VideoModal({ video, onClose }) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const videoId = extractYouTubeId(video?.youtubeUrl);

  useEffect(() => {
    if (!video) {
      document.body.style.overflow = "";
      return undefined;
    }

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      } else {
        trapFocus(event, modalRef.current);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [video, onClose]);

  if (!video || !videoId) {
    return null;
  }

  return (
    <div className="player-modal" role="dialog" aria-modal="true" aria-label={video.title} ref={modalRef}>
      <div className="player-shell">
        <button ref={closeButtonRef} type="button" className="player-close" onClick={onClose}>
          Close
        </button>
        <div className="player-frame-wrap">
          <iframe
            className="player-frame"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
      <button type="button" className="player-backdrop" aria-label="Close video player" onClick={onClose} />
    </div>
  );
}
