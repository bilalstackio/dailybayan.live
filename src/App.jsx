import { useEffect, useState } from "react";
import NavBar from "./components/Layout/NavBar.jsx";
import HeroSection from "./components/Hero/HeroSection.jsx";
import PrayerTimesBar from "./components/Prayer/PrayerTimesBar.jsx";
import JourneySection from "./components/Journey/JourneySection.jsx";
import HighlightsStrip from "./components/Highlights/HighlightsStrip.jsx";
import LiveSection from "./components/Live/LiveSection.jsx";
import ScheduleSection from "./components/Schedule/ScheduleSection.jsx";
import VideoRow from "./components/Videos/VideoRow.jsx";
import TestimonialsSection from "./components/SocialProof/TestimonialsSection.jsx";
import FaqSection from "./components/Faq/FaqSection.jsx";
import SubscribeSection from "./components/Subscribe/SubscribeSection.jsx";
import Footer from "./components/Layout/Footer.jsx";
import VideoModal from "./components/Player/VideoModal.jsx";
import {
  fallbackSiteContent,
  fallbackVideoData,
  loadSiteContent,
  loadVideoData
} from "./services/contentLoader.js";

export default function App() {
  const [siteContent, setSiteContent] = useState(fallbackSiteContent);
  const [videoData, setVideoData] = useState(fallbackVideoData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);
  const [openFaqId, setOpenFaqId] = useState(null);

  useEffect(() => {
    async function loadContent() {
      const results = await Promise.allSettled([loadSiteContent(), loadVideoData()]);
      const errors = [];

      if (results[0].status === "fulfilled") {
        setSiteContent(results[0].value);
      } else {
        errors.push("Site content could not be loaded.");
      }

      if (results[1].status === "fulfilled") {
        setVideoData(results[1].value);
      } else {
        errors.push("Video content could not be loaded.");
      }

      if (errors.length) {
        setError(errors.join(" "));
      }

      setLoading(false);
    }

    loadContent();
  }, []);

  return (
    <div className="page">
      <PrayerTimesBar />
      <NavBar brand={siteContent.brand} nav={siteContent.nav} />
      <LiveSection id="live" live={videoData.live} />
      <HeroSection hero={siteContent.hero} />

      <main id="library" className="content">
        {loading && <p className="status">Loading content...</p>}
        {!loading && error && <p className="status error">{error}</p>}

        {videoData.sections.map((section) => (
          <VideoRow
            key={section.id}
            title={section.title}
            description={section.description}
            videos={section.videos}
            onWatch={setActiveVideo}
          />
        ))}

        <JourneySection id="journey" tracks={siteContent.journeyTracks} />
        <HighlightsStrip items={siteContent.highlights} />
        <ScheduleSection id="schedule" schedule={siteContent.schedule} />

        <TestimonialsSection id="testimonials" testimonials={siteContent.testimonials} />
        <FaqSection id="faq" faq={siteContent.faq} openFaqId={openFaqId} setOpenFaqId={setOpenFaqId} />
        <SubscribeSection id="subscribe" subscribe={siteContent.subscribe} />
      </main>

      <Footer footer={siteContent.footer} />
      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </div>
  );
}
