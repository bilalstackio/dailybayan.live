import { useEffect, useMemo, useState } from "react";

const PRAYER_ORDER = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const PRAYER_LABELS = {
  Fajr: "Fajr",
  Dhuhr: "Dhuhr",
  Asr: "Asr",
  Maghrib: "Maghrib",
  Isha: "Isha"
};

function formatLocation(label, coords) {
  if (label) {
    return label;
  }
  if (!coords) {
    return "Location unavailable";
  }
  return `${coords.lat.toFixed(2)}, ${coords.lng.toFixed(2)}`;
}

function parsePrayerTime(baseDate, timeValue) {
  if (!timeValue) {
    return null;
  }

  const clean = String(timeValue).split(" ")[0];
  const [rawHour, rawMinute] = clean.split(":");
  const hour = Number(rawHour);
  const minute = Number(rawMinute);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return null;
  }

  const localDate = new Date(baseDate);
  localDate.setHours(hour, minute, 0, 0);
  return localDate;
}

function getNextPrayer(timings) {
  const now = new Date();
  const prayers = PRAYER_ORDER.map((key) => ({
    key,
    label: PRAYER_LABELS[key],
    date: parsePrayerTime(now, timings?.[key])
  })).filter((prayer) => prayer.date instanceof Date && !Number.isNaN(prayer.date.getTime()));

  const upcoming = prayers.find((prayer) => prayer.date > now);
  if (upcoming) {
    return upcoming;
  }

  const tomorrowFajr = parsePrayerTime(new Date(now.getTime() + 24 * 60 * 60 * 1000), timings?.Fajr);
  if (!tomorrowFajr) {
    return null;
  }

  return { key: "Fajr", label: "Fajr", date: tomorrowFajr };
}

function formatCountdown(targetDate, nowTick) {
  if (!targetDate) {
    return "--:--";
  }

  const diffMs = targetDate.getTime() - nowTick;
  if (diffMs <= 0) {
    return "00:00";
  }

  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m`;
}

function toTimeDisplay(dateValue) {
  if (!dateValue) {
    return "--:--";
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit"
  }).format(dateValue);
}

export default function PrayerTimesBar() {
  const [coords, setCoords] = useState(null);
  const [locationLabel, setLocationLabel] = useState("");
  const [timings, setTimings] = useState(null);
  const [status, setStatus] = useState("Requesting location...");
  const [nowTick, setNowTick] = useState(Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNowTick(Date.now());
    }, 30000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadFromCoords(positionCoords) {
      try {
        const dateKey = new Date().toISOString().split("T")[0];
        const timingsResponse = await fetch(
          `https://api.aladhan.com/v1/timings/${dateKey}?latitude=${positionCoords.lat}&longitude=${positionCoords.lng}&method=2`
        );
        const timingsJson = await timingsResponse.json();
        const nextTimings = timingsJson?.data?.timings;

        if (!active || !nextTimings) {
          return;
        }

        setTimings(nextTimings);
        setStatus("");
      } catch {
        if (active) {
          setStatus("Prayer times are currently unavailable.");
        }
      }

      try {
        const reverseResponse = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${positionCoords.lat}&longitude=${positionCoords.lng}&localityLanguage=en`
        );
        const reverseJson = await reverseResponse.json();
        if (!active) {
          return;
        }
        const city = reverseJson?.city || reverseJson?.locality || reverseJson?.principalSubdivision;
        const country = reverseJson?.countryName;
        setLocationLabel([city, country].filter(Boolean).join(", "));
      } catch {
        // Keep coordinate fallback when reverse geocoding is unavailable.
      }
    }

    function setFromGeolocation() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!active) {
            return;
          }
          const nextCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCoords(nextCoords);
          setStatus("Loading prayer times...");
          loadFromCoords(nextCoords);
        },
        async () => {
          try {
            const ipResponse = await fetch("https://ipapi.co/json/");
            const ipJson = await ipResponse.json();

            if (!active) {
              return;
            }

            const nextCoords = {
              lat: Number(ipJson?.latitude),
              lng: Number(ipJson?.longitude)
            };

            if (Number.isNaN(nextCoords.lat) || Number.isNaN(nextCoords.lng)) {
              setStatus("Enable location access for prayer times.");
              return;
            }

            setCoords(nextCoords);
            setLocationLabel([ipJson?.city, ipJson?.country_name].filter(Boolean).join(", "));
            setStatus("Loading prayer times...");
            loadFromCoords(nextCoords);
          } catch {
            if (active) {
              setStatus("Enable location access for prayer times.");
            }
          }
        },
        { timeout: 10000, maximumAge: 300000 }
      );
    }

    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported in this browser.");
      return () => {
        active = false;
      };
    }

    setFromGeolocation();
    return () => {
      active = false;
    };
  }, []);

  const nextPrayer = useMemo(() => getNextPrayer(timings), [timings, nowTick]);

  return (
    <section className="prayer-banner" aria-live="polite">
      <div className="prayer-banner-main">
        <p className="prayer-eyebrow">Next Prayer</p>
        <h2>
          {nextPrayer ? nextPrayer.label : "Loading"} in{" "}
          <span className="prayer-countdown">{formatCountdown(nextPrayer?.date, nowTick)}</span>
        </h2>
        <p className="prayer-meta">
          At {toTimeDisplay(nextPrayer?.date)} • {status || `Your location: ${formatLocation(locationLabel, coords)}`}
        </p>
      </div>
      <div className="prayer-grid">
        {PRAYER_ORDER.map((prayerKey) => (
          <div key={prayerKey} className={`prayer-chip ${nextPrayer?.key === prayerKey ? "active" : ""}`}>
            <span>{PRAYER_LABELS[prayerKey]}</span>
            <strong>{timings?.[prayerKey] ? timings[prayerKey].split(" ")[0] : "--:--"}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
