const defaultBrand = {
  title: "DAILY BAYAN",
  subtitle: "Ramadan Companion"
};

export const fallbackSiteContent = {
  brand: defaultBrand,
  nav: [
    { label: "Journey", href: "#journey" },
    { label: "Live", href: "#live" },
    { label: "Schedule", href: "#schedule" },
    { label: "Library", href: "#library" },
    { label: "FAQ", href: "#faq" },
    { label: "Subscribe", href: "#subscribe" }
  ],
  hero: {
    badge: "Ramadan 2026",
    title: "A Guided Journey Through Ramadan",
    description:
      "Structured daily learning with live sessions, reminders, and practical growth for families and communities.",
    verse: "Bismillah ir-Rahman ir-Raheem",
    primaryCta: { label: "Watch Live", href: "#live" },
    secondaryCta: { label: "Open Library", href: "#library" }
  },
  journeyTracks: [
    {
      id: "quran",
      title: "Quran Reflection",
      description: "Daily reflections for clearer understanding and practice.",
      cta: "Start Reflection"
    },
    {
      id: "character",
      title: "Character Building",
      description: "Habits and reminders to improve sincerity, patience, and discipline.",
      cta: "Build Habits"
    },
    {
      id: "community",
      title: "Family and Community",
      description: "Shared sessions and resources for homes and local circles.",
      cta: "Join Sessions"
    }
  ],
  highlights: [
    { id: "days", label: "Program Length", value: "30 Days" },
    { id: "sessions", label: "Live Sessions", value: "Daily" },
    { id: "format", label: "Learning Format", value: "Video + Reflection" }
  ],
  schedule: [
    {
      id: "week-1",
      title: "Week 1: Foundations",
      items: ["Intentions and sincerity", "Quran mindset", "Daily structure"]
    },
    {
      id: "week-2",
      title: "Week 2: Practice",
      items: ["Consistent worship", "Better adab", "Family implementation"]
    }
  ],
  testimonials: [
    {
      id: "t1",
      name: "Amina K.",
      location: "Chicago",
      quote: "The daily structure kept our family connected to learning every night."
    },
    {
      id: "t2",
      name: "Yusuf R.",
      location: "Houston",
      quote: "Clear, practical reminders helped me stay consistent this Ramadan."
    }
  ],
  faq: [
    {
      id: "f1",
      question: "How do I follow the program daily?",
      answer: "Use the schedule and watch the live or recorded section each day."
    },
    {
      id: "f2",
      question: "Can I watch previous sessions later?",
      answer: "Yes, all video rows are available on demand inside the website."
    }
  ],
  subscribe: {
    title: "Stay Updated Throughout Ramadan",
    description: "Get daily reminders and newly added bayan videos.",
    placeholder: "Enter your email",
    buttonLabel: "Notify Me"
  },
  footer: {
    note: "Edit JSON files in public/ to update your content.",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" }
    ]
  }
};

export const fallbackVideoData = {
  live: {
    title: "Live Bayan",
    description: "Now playing",
    youtubeUrl: "",
    autoplay: true,
    mute: true
  },
  sections: []
};

function normalizeSiteContent(raw = {}) {
  return {
    brand: {
      title: raw.brand?.title || fallbackSiteContent.brand.title,
      subtitle: raw.brand?.subtitle || fallbackSiteContent.brand.subtitle
    },
    nav: Array.isArray(raw.nav) && raw.nav.length ? raw.nav : fallbackSiteContent.nav,
    hero: {
      badge: raw.hero?.badge || fallbackSiteContent.hero.badge,
      title: raw.hero?.title || fallbackSiteContent.hero.title,
      description: raw.hero?.description || fallbackSiteContent.hero.description,
      verse: raw.hero?.verse || fallbackSiteContent.hero.verse,
      primaryCta: {
        label: raw.hero?.primaryCta?.label || fallbackSiteContent.hero.primaryCta.label,
        href: raw.hero?.primaryCta?.href || fallbackSiteContent.hero.primaryCta.href
      },
      secondaryCta: {
        label: raw.hero?.secondaryCta?.label || fallbackSiteContent.hero.secondaryCta.label,
        href: raw.hero?.secondaryCta?.href || fallbackSiteContent.hero.secondaryCta.href
      }
    },
    journeyTracks:
      Array.isArray(raw.journeyTracks) && raw.journeyTracks.length
        ? raw.journeyTracks
        : fallbackSiteContent.journeyTracks,
    highlights:
      Array.isArray(raw.highlights) && raw.highlights.length
        ? raw.highlights
        : fallbackSiteContent.highlights,
    schedule:
      Array.isArray(raw.schedule) && raw.schedule.length ? raw.schedule : fallbackSiteContent.schedule,
    testimonials:
      Array.isArray(raw.testimonials) && raw.testimonials.length
        ? raw.testimonials
        : fallbackSiteContent.testimonials,
    faq: Array.isArray(raw.faq) && raw.faq.length ? raw.faq : fallbackSiteContent.faq,
    subscribe: {
      title: raw.subscribe?.title || fallbackSiteContent.subscribe.title,
      description: raw.subscribe?.description || fallbackSiteContent.subscribe.description,
      placeholder: raw.subscribe?.placeholder || fallbackSiteContent.subscribe.placeholder,
      buttonLabel: raw.subscribe?.buttonLabel || fallbackSiteContent.subscribe.buttonLabel
    },
    footer: {
      note: raw.footer?.note || fallbackSiteContent.footer.note,
      links:
        Array.isArray(raw.footer?.links) && raw.footer.links.length
          ? raw.footer.links
          : fallbackSiteContent.footer.links
    }
  };
}

function normalizeVideoData(raw = {}) {
  return {
    live: {
      title: raw.live?.title || fallbackVideoData.live.title,
      description: raw.live?.description || fallbackVideoData.live.description,
      youtubeUrl: raw.live?.youtubeUrl || fallbackVideoData.live.youtubeUrl,
      autoplay: raw.live?.autoplay ?? true,
      mute: raw.live?.mute ?? true
    },
    sections: Array.isArray(raw.sections)
      ? raw.sections.map((section, sectionIndex) => ({
          id: section.id || section.title || `section-${sectionIndex + 1}`,
          title: section.title || "Section",
          description: section.description || "",
          videos: Array.isArray(section.videos)
            ? section.videos.map((video, videoIndex) => ({
                id: video.id || video.title || `video-${sectionIndex + 1}-${videoIndex + 1}`,
                title: video.title || "Untitled Video",
                youtubeUrl: video.youtubeUrl || ""
              }))
            : []
        }))
      : fallbackVideoData.sections
  };
}

async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path} (${response.status})`);
  }
  return response.json();
}

export async function loadSiteContent() {
  const raw = await fetchJson("/site-content.json");
  return normalizeSiteContent(raw);
}

export async function loadVideoData() {
  const raw = await fetchJson("/videos.json");
  return normalizeVideoData(raw);
}
