export class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentRoute = null;
    this._onHashChange = this._onHashChange.bind(this);
    window.addEventListener('hashchange', this._onHashChange);
  }

  _onHashChange() {
    const hash = window.location.hash.slice(1) || '/';
    this.navigate(hash);
  }

  navigate(path) {
    const route = this.routes.find(r => r.path === path) || this.routes.find(r => r.path === '/');
    if (!route) return;

    if (this.currentRoute && this.currentRoute.onLeave) {
      this.currentRoute.onLeave();
    }

    this.currentRoute = route;
    route.handler();
  }

  start() {
    const hash = window.location.hash.slice(1) || '/';
    this.navigate(hash);
  }

  destroy() {
    window.removeEventListener('hashchange', this._onHashChange);
  }
}
