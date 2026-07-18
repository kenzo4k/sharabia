import * as React from "react"
import { useLocation } from "react-router-dom"
import api from "@/services/api"

// Helper to generate a unique session ID
const generateSessionID = () => {
  return "session_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export const trackAnalyticsEvent = async (action, customPath = null) => {
  try {
    const sessionID = localStorage.getItem("analytics_session_id") || generateSessionID();
    if (!localStorage.getItem("analytics_session_id")) {
      localStorage.setItem("analytics_session_id", sessionID);
    }

    const utmSource = sessionStorage.getItem("analytics_utm_source") || "direct";
    const path = customPath || window.location.pathname;

    // Fire log
    await api.post("/analytics/track", {
      path,
      sessionID,
      utmSource,
      action
    });
  } catch (err) {
    console.warn("Analytics tracking failed:", err.message);
  }
}

export default function TrafficTracker() {
  const location = useLocation();

  React.useEffect(() => {
    // 1. Ensure sessionID exists
    let sessionID = localStorage.getItem("analytics_session_id");
    if (!sessionID) {
      sessionID = generateSessionID();
      localStorage.setItem("analytics_session_id", sessionID);
    }

    // 2. Capture UTM parameter if present in query string
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get("utm_source");
    if (utmSource) {
      sessionStorage.setItem("analytics_utm_source", utmSource.trim().toLowerCase());
    } else if (!sessionStorage.getItem("analytics_utm_source")) {
      sessionStorage.setItem("analytics_utm_source", "direct");
    }

    // 3. Track page view on route change
    trackAnalyticsEvent("view", location.pathname);

  }, [location.pathname]);

  // Expose to window for easy inline event firing (cart additions, etc.)
  React.useEffect(() => {
    window.trackAnalyticsEvent = trackAnalyticsEvent;
  }, []);

  return null;
}
