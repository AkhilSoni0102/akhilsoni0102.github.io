(function () {
  const STORAGE_KEY = "akhil_site_analytics_v1";
  const MAX_EVENTS = 250;

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { pageViews: {}, events: [] };
    } catch {
      return { pageViews: {}, events: [] };
    }
  }

  function save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage errors; tracking should never break UX.
    }
  }

  function record(type, name) {
    const state = load();
    const day = new Date().toISOString().slice(0, 10);

    if (type === "pageview") {
      const key = `${day}:${name}`;
      state.pageViews[key] = (state.pageViews[key] || 0) + 1;
    } else {
      state.events.push({
        t: day,
        event: name,
      });
      if (state.events.length > MAX_EVENTS) {
        state.events = state.events.slice(state.events.length - MAX_EVENTS);
      }
    }

    save(state);
  }

  function trackPageView() {
    const path = window.location.pathname || "/";
    record("pageview", path);
  }

  function trackClicks() {
    document.addEventListener("click", function (event) {
      const target = event.target.closest("[data-track]");
      if (!target) {
        return;
      }
      record("event", target.getAttribute("data-track"));
    });
  }

  trackPageView();
  trackClicks();
})();

