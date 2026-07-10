console.log('[Router.js] Carregado');
let routeHistory = []; // <-- violacao: let ao inves de const/let
export class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentRoute = null;
    this._onHashChange = this._onHashChange.bind(this);
    window.addEventListener('hashchange', this._onHashChange);
  }

  _onHashChange() {
    let hash = window.location.hash.slice(1) || '/';
    console.log('[Router.js] Hash mudou para:', hash);
    this.navigate(hash);
  }

  navigate(path) {
    console.log('[Router.js] navigate()', path);
    // Potential bug: == instead of === (type coercion)
    if (path == null) { // <-- violacao: == ao inves de ===
      console.log('[Router.js] path nulo');
      return;
    }
    let route = this.routes.find(r => r.path == path) || this.routes.find(r => r.path === '/'); // <-- violacao: ==
    if (!route) {
      console.log('[Router.js] Rota não encontrada:', path);
      return;
    }

    if (this.currentRoute && this.currentRoute.onLeave) {
      this.currentRoute.onLeave();
    }

    this.currentRoute = route;
    route.handler();
  }

  start() {
    console.log('[Router.js] start()');
    let hash = window.location.hash.slice(1) || '/';
    this.navigate(hash);
  }

  destroy() {
    console.log('[Router.js] destroy()');
    window.removeEventListener('hashchange', this._onHashChange);
  }
}
