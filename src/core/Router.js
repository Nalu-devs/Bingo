console.log('[Router.js] Carregado');
export class Router {
  constructor(routes) {
    console.log('[Router.js] Construtor com rotas:', routes.length);
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
      console.log('[Router.js] Chamando onLeave da rota anterior');
      this.currentRoute.onLeave();
    }

    this.currentRoute = route;
    console.log('[Router.js] Executando handler para:', path);
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
