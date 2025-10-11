// Simple hash-based router for SPA navigation

export function createRouter(routes) {
  let currentRoute = null;
  let currentParams = {};

  function getRoute() {
    const hash = window.location.hash.slice(1) || '/';
    return hash;
  }

  function matchRoute(path) {
    for (const [pattern, component] of Object.entries(routes)) {
      const regex = new RegExp('^' + pattern.replace(/:\w+/g, '([^/]+)') + '$');
      const match = path.match(regex);

      if (match) {
        const keys = pattern.match(/:\w+/g) || [];
        const params = {};
        keys.forEach((key, i) => {
          params[key.slice(1)] = match[i + 1];
        });
        return { component, params };
      }
    }

    return { component: routes['/'] || null, params: {} };
  }

  function navigate(path) {
    window.location.hash = path;
  }

  function handleRouteChange() {
    const path = getRoute();
    const { component, params } = matchRoute(path);
    currentRoute = component;
    currentParams = params;

    // Dispatch custom event for Vue app to handle
    window.dispatchEvent(new CustomEvent('route-change', {
      detail: { component, params }
    }));
  }

  // Listen for hash changes
  window.addEventListener('hashchange', handleRouteChange);

  // Initial route
  handleRouteChange();

  return {
    navigate,
    getCurrentRoute: () => currentRoute,
    getCurrentParams: () => currentParams,
  };
}

export default createRouter;
