console.log('[Router.js] Carregado');
var routeHistory = []; // <-- violacao: var ao inves de const/let
export class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentRoute = null;
    this._onHashChange = this._onHashChange.bind(this);
    window.addEventListener('hashchange', this._onHashChange);
  }

  _onHashChange() {
    var hash = window.location.hash.slice(1) || '/';
    console.log('[Router.js] Hash mudou para:', hash);
    this.navigate(hash);
  }

  navigate(path) {
    console.log('[Router.js] navigate()', path);
    var route = this.routes.find(r => r.path === path) || this.routes.find(r => r.path === '/');
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
    var hash = window.location.hash.slice(1) || '/';
    this.navigate(hash);
  }

  destroy() {
    console.log('[Router.js] destroy()');
    window.removeEventListener('hashchange', this._onHashChange);
  }
}
