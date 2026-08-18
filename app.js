(() => {
  const STORAGE_KEY_ALIMENTOS = 'controle_alimentos';
  const STORAGE_KEY_MOVIMENTACOES = 'controle_movimentacoes';
  const DIAS_PROXIMO_VENCIMENTO = 30;

  /* ===== DADOS ===== */

  function carregarAlimentos() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_ALIMENTOS)) || [];
    } catch {
      return [];
    }
  }

  function salvarAlimentos(lista) {
    localStorage.setItem(STORAGE_KEY_ALIMENTOS, JSON.stringify(lista));
  }

  function carregarMovimentacoes() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_MOVIMENTACOES)) || [];
    } catch {
      return [];
    }
  }

  function salvarMovimentacoes(lista) {
    localStorage.setItem(STORAGE_KEY_MOVIMENTACOES, JSON.stringify(lista));
  }

  /* ===== UTILITÁRIOS ===== */

  function gerarId() {
    return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  function formatarData(dataStr) {
    if (!dataStr) return '-';
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  function formatarMoeda(valor) {
    if (valor === null || valor === undefined || valor === '') return '-';
    return `R$ ${Number(valor).toFixed(2).replace('.', ',')}`;
  }

  function obterHoje() {
    return new Date().toISOString().split('T')[0];
  }

  function diasAteVencimento(dataValidade) {
    if (!dataValidade) return Infinity;
    const hoje = new Date(obterHoje());
    const vencimento = new Date(dataValidade);
    return Math.ceil((vencimento - hoje) / (1000 * 60 * 60 * 24));
  }

  /* ===== STATUS ===== */

  function statusValidade(alimento) {
    const dias = diasAteVencimento(alimento.dataValidade);
    if (dias < 0) return 'vencido';
    if (dias <= DIAS_PROXIMO_VENCIMENTO) return 'proximo';
    return 'ok';
  }

  function statusEstoque(alimento) {
    const qtd = Number(alimento.quantidade);
    const min = Number(alimento.estoqueMinimo) || 0;
    if (qtd <= 0) return 'sem-estoque';
    if (min > 0 && qtd < min) return 'estoque-baixo';
    return 'ok';
  }

  function statusGeral(alimento) {
    const ve = statusValidade(alimento);
    if (ve !== 'ok') return ve;
    const es = statusEstoque(alimento);
    if (es !== 'ok') return es;
    return 'ok';
  }

  function labelStatus(status) {
    const mapa = {
      'ok': 'Em estoque',
      'proximo': 'Próximo do vencimento',
      'vencido': 'Vencido',
      'estoque-baixo': 'Estoque baixo',
      'sem-estoque': 'Sem estoque'
    };
    return mapa[status] || status;
  }

  /* ===== TOAST ===== */

  function mostrarToast(mensagem, tipo = 'sucesso') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    toast.textContent = mensagem;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  /* ===== NAVEGAÇÃO ===== */

  function initTabs() {
    const botoes = document.querySelectorAll('.nav-btn');
    botoes.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        botoes.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
        document.getElementById('tab-' + tab).classList.add('active');
        if (tab === 'estoque') renderizarEstoque();
        if (tab === 'movimentacoes') renderizarMovimentacoes();
        if (tab === 'alertas') renderizarAlertas();
      });
    });
  }

  /* ===== FILTROS DE MARCA E FORNECEDOR (dinâmicos) ===== */

  function atualizarFiltrosDinamicos() {
    const alimentos = carregarAlimentos();
    const marcas = [...new Set(alimentos.map(a => a.marca).filter(Boolean))].sort();
    const fornecedores = [...new Set(alimentos.map(a => a.fornecedor).filter(Boolean))].sort();

    const selectMarca = document.getElementById('filtro-marca');
    const selectForn = document.getElementById('filtro-fornecedor');
    const valMarca = selectMarca.value;
    const valForn = selectForn.value;

    selectMarca.innerHTML = '<option value="">Todas marcas</option>' +
      marcas.map(m => `<option value="${m}" ${m === valMarca ? 'selected' : ''}>${m}</option>`).join('');

    selectForn.innerHTML = '<option value="">Todos fornecedores</option>' +
      fornecedores.map(f => `<option value="${f}" ${f === valForn ? 'selected' : ''}>${f}</option>`).join('');
  }

  /* ===== LISTAGEM: ESTOQUE ===== */

  function renderizarEstoque() {
    const alimentos = carregarAlimentos();
    const container = document.getElementById('lista-estoque');

    const busca = document.getElementById('busca-geral').value.toLowerCase();
    const filtroCategoria = document.getElementById('filtro-categoria').value;
    const filtroMarca = document.getElementById('filtro-marca').value;
    const filtroLocal = document.getElementById('filtro-local').value;
    const filtroFornecedor = document.getElementById('filtro-fornecedor').value;
    const filtroSituacao = document.getElementById('filtro-situacao').value;
    const filtroValidadeInicio = document.getElementById('filtro-validade-inicio').value;
    const filtroValidadeFim = document.getElementById('filtro-validade-fim').value;

    let filtrados = alimentos.filter(a => {
      if (busca && !a.nome.toLowerCase().includes(busca)) return false;
      if (filtroCategoria && a.categoria !== filtroCategoria) return false;
      if (filtroMarca && a.marca !== filtroMarca) return false;
      if (filtroLocal && a.local !== filtroLocal) return false;
      if (filtroFornecedor && a.fornecedor !== filtroFornecedor) return false;
      if (filtroSituacao) {
        const sg = statusGeral(a);
        if (sg !== filtroSituacao) return false;
      }
      if (filtroValidadeInicio && a.dataValidade < filtroValidadeInicio) return false;
      if (filtroValidadeFim && a.dataValidade > filtroValidadeFim) return false;
      return true;
    });

    if (filtrados.length === 0) {
      container.innerHTML = '<div class="vazio"><div class="vazio-icon">📦</div>Nenhum alimento encontrado.</div>';
      return;
    }

    container.innerHTML = filtrados.map(a => {
      const sg = statusGeral(a);
      const dias = diasAteVencimento(a.dataValidade);
      let validadeTxt = '';
      if (dias < 0) validadeTxt = `Vencido há ${Math.abs(dias)} dia(s)`;
      else if (dias === 0) validadeTxt = 'Vence hoje!';
      else if (dias <= DIAS_PROXIMO_VENCIMENTO) validadeTxt = `Vence em ${dias} dia(s)`;
      else validadeTxt = `Vence em ${dias} dia(s)`;

      return `
        <div class="card-alimento status-${sg}">
          <div class="card-info">
            <h3>${a.nome}</h3>
            <div class="card-meta">
              <span>${a.categoria}</span>
              <span>${a.quantidade} ${a.unidade}</span>
              <span>${a.local}</span>
              <span>Validade: ${formatarData(a.dataValidade)} (${validadeTxt})</span>
              ${a.marca ? `<span>Marca: ${a.marca}</span>` : ''}
              ${a.fornecedor ? `<span>Fornecedor: ${a.fornecedor}</span>` : ''}
            </div>
            <div class="card-badges">
              ${sg !== 'ok' ? `<span class="badge badge-${sg}">${labelStatus(sg)}</span>` : `<span class="badge badge-ok">OK</span>`}
              ${Number(a.estoqueMinimo) > 0 && Number(a.quantidade) < Number(a.estoqueMinimo) ? `<span class="badge badge-estoque-baixo">Mín: ${a.estoqueMinimo} ${a.unidade}</span>` : ''}
            </div>
          </div>
          <div class="card-actions">
            <button class="btn-primary btn-small" onclick="window.__app.abrirModalMovimentacao('${a.id}')">Movimentar</button>
            <button class="btn-secondary btn-small" onclick="window.__app.verDetalhe('${a.id}')">Detalhes</button>
            <button class="btn-secondary btn-small" onclick="window.__app.editarAlimento('${a.id}')">Editar</button>
            <button class="btn-danger btn-small" onclick="window.__app.excluirAlimento('${a.id}')">Excluir</button>
          </div>
        </div>`;
    }).join('');
  }

  /* ===== LISTAGEM: MOVIMENTAÇÕES ===== */

  function renderizarMovimentacoes() {
    const movimentacoes = carregarMovimentacoes();
    const alimentos = carregarAlimentos();
    const container = document.getElementById('lista-movimentacoes');

    const busca = document.getElementById('busca-mov').value.toLowerCase();
    const filtroTipo = document.getElementById('filtro-tipo-mov').value;
    const filtroMotivo = document.getElementById('filtro-motivo-mov').value;
    const filtroDataInicio = document.getElementById('filtro-data-inicio').value;
    const filtroDataFim = document.getElementById('filtro-data-fim').value;

    let filtradas = movimentacoes.filter(m => {
      const alimento = alimentos.find(a => a.id === m.alimentoId);
      const nomeAlimento = alimento ? alimento.nome.toLowerCase() : '';
      if (busca && !nomeAlimento.includes(busca)) return false;
      if (filtroTipo && m.tipo !== filtroTipo) return false;
      if (filtroMotivo && m.motivo !== filtroMotivo) return false;
      if (filtroDataInicio && m.data < filtroDataInicio) return false;
      if (filtroDataFim && m.data > filtroDataFim) return false;
      return true;
    });

    filtradas.sort((a, b) => b.data.localeCompare(a.data) || b.criadoEm.localeCompare(a.criadoEm));

    if (filtradas.length === 0) {
      container.innerHTML = '<div class="vazio"><div class="vazio-icon">📋</div>Nenhuma movimentação encontrada.</div>';
      return;
    }

    container.innerHTML = filtradas.map(m => {
      const alimento = alimentos.find(a => a.id === m.alimentoId);
      const nome = alimento ? alimento.nome : '(alimento removido)';
      const unidade = alimento ? alimento.unidade : '';
      const tipoLabel = m.tipo === 'entrada' ? '➕ Entrada' : '➖ Saída';
      return `
        <div class="card-movimentacao tipo-${m.tipo}">
          <div class="card-info">
            <h3>${nome}</h3>
            <div class="card-meta">
              <span>${tipoLabel}</span>
              <span>${m.quantidade} ${unidade}</span>
              <span>${formatarData(m.data)}</span>
              <span>${m.responsavel}</span>
              <span>${m.motivo}</span>
              ${m.observacoes ? `<span>${m.observacoes}</span>` : ''}
            </div>
          </div>
          <div class="card-actions">
            <button class="btn-secondary btn-small" onclick="window.__app.editarMovimentacao('${m.id}')">Editar</button>
            <button class="btn-danger btn-small" onclick="window.__app.excluirMovimentacao('${m.id}')">Excluir</button>
          </div>
        </div>`;
    }).join('');
  }

  /* ===== ALERTAS ===== */

  function gerarAlertas() {
    const alimentos = carregarAlimentos();
    const alertas = [];

    alimentos.forEach(a => {
      const sv = statusValidade(a);
      const se = statusEstoque(a);
      const dias = diasAteVencimento(a.dataValidade);

      if (sv === 'vencido') {
        alertas.push({ tipo: 'danger', msg: `🔴 O ${a.nome} está vencido.` });
      } else if (sv === 'proximo') {
        alertas.push({ tipo: 'warning', msg: `⚠️ O ${a.nome} está próximo do vencimento (${dias} dia(s)).` });
      }

      if (se === 'sem-estoque') {
        alertas.push({ tipo: 'danger', msg: `🔴 O ${a.nome} está sem estoque.` });
      } else if (se === 'estoque-baixo') {
        alertas.push({ tipo: 'warning', msg: `⚠️ O ${a.nome} está com estoque abaixo do mínimo (${a.quantidade} ${a.unidade}, mínimo: ${a.estoqueMinimo} ${a.unidade}).` });
      }
    });

    return alertas;
  }

  function renderizarAlertas() {
    const alertas = gerarAlertas();
    const container = document.getElementById('painel-alertas');
    const ribbon = document.getElementById('alertas-ribbon');

    ribbon.innerHTML = alertas.slice(0, 3).map(a =>
      `<div class="ribbon-alert alert-${a.tipo}">${a.msg}</div>`
    ).join('');

    if (alertas.length === 0) {
      container.innerHTML = '<div class="vazio"><div class="vazio-icon">✅</div>Nenhum alerta no momento.</div>';
      return;
    }

    container.innerHTML = alertas.map(a =>
      `<div class="ribbon-alert alert-${a.tipo}">${a.msg}</div>`
    ).join('');
  }

  /* ===== FORMULÁRIO: CADASTRO/EDIÇÃO ===== */

  function abrirModalCadastro(alimentoId) {
    const alimentos = carregarAlimentos();
    const a = alimentoId ? alimentos.find(x => x.id === alimentoId) : null;

    document.getElementById('edit-id').value = a ? a.id : '';
    document.getElementById('titulo-form').textContent = a ? 'Editar Alimento' : 'Cadastrar Alimento';
    document.getElementById('btn-submit').textContent = a ? 'Salvar Alterações' : 'Cadastrar';

    if (a) {
      document.getElementById('nome').value = a.nome || '';
      document.getElementById('categoria').value = a.categoria || '';
      document.getElementById('marca').value = a.marca || '';
      document.getElementById('lote').value = a.lote || '';
      document.getElementById('codigo-interno').value = a.codigoInterno || '';
      document.getElementById('quantidade').value = a.quantidade ?? '';
      document.getElementById('unidade').value = a.unidade || '';
      document.getElementById('estoque-minimo').value = a.estoqueMinimo ?? '';
      document.getElementById('data-validade').value = a.dataValidade || '';
      document.getElementById('local').value = a.local || '';
      document.getElementById('data-entrada').value = a.dataEntrada || '';
      document.getElementById('preco').value = a.preco ?? '';
      document.getElementById('fornecedor').value = a.fornecedor || '';
      document.getElementById('observacoes').value = a.observacoes || '';
    } else {
      document.getElementById('form-alimento').reset();
      document.getElementById('data-entrada').value = obterHoje();
    }

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-tab="cadastro"]').classList.add('active');
    document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
    document.getElementById('tab-cadastro').classList.add('active');
  }

  function limparFormulario() {
    document.getElementById('form-alimento').reset();
    document.getElementById('edit-id').value = '';
    document.getElementById('titulo-form').textContent = 'Cadastrar Alimento';
    document.getElementById('btn-submit').textContent = 'Cadastrar';
    document.querySelectorAll('.form-group .error-msg').forEach(e => e.classList.remove('visible'));
    document.querySelectorAll('.form-group .error').forEach(e => e.classList.remove('error'));
  }

  function validarFormularioAlimento(dados) {
    let valido = true;
    const erros = [];

    if (!dados.nome || !dados.nome.trim()) {
      erros.push({ campo: 'nome', msg: 'Nome é obrigatório.' });
      valido = false;
    }
    if (!dados.categoria) {
      erros.push({ campo: 'categoria', msg: 'Categoria é obrigatória.' });
      valido = false;
    }
    if (dados.quantidade === '' || dados.quantidade === null || dados.quantidade === undefined) {
      erros.push({ campo: 'quantidade', msg: 'Quantidade é obrigatória.' });
      valido = false;
    } else if (Number(dados.quantidade) < 0) {
      erros.push({ campo: 'quantidade', msg: 'Quantidade não pode ser negativa.' });
      valido = false;
    }
    if (!dados.unidade) {
      erros.push({ campo: 'unidade', msg: 'Unidade de medida é obrigatória.' });
      valido = false;
    }
    if (!dados.dataValidade) {
      erros.push({ campo: 'data-validade', msg: 'Data de validade é obrigatória.' });
      valido = false;
    }
    if (!dados.local) {
      erros.push({ campo: 'local', msg: 'Local de armazenamento é obrigatório.' });
      valido = false;
    }
    if (dados.dataEntrada && dados.dataEntrada > obterHoje()) {
      erros.push({ campo: 'data-entrada', msg: 'Data de entrada não pode ser futura.' });
      valido = false;
    }

    document.querySelectorAll('.form-group .error-msg').forEach(e => e.classList.remove('visible'));
    document.querySelectorAll('.form-group .error').forEach(e => e.classList.remove('error'));

    erros.forEach(erro => {
      const input = document.getElementById(erro.campo);
      if (input) {
        input.classList.add('error');
        let msgEl = input.parentElement.querySelector('.error-msg');
        if (!msgEl) {
          msgEl = document.createElement('div');
          msgEl.className = 'error-msg';
          input.parentElement.appendChild(msgEl);
        }
        msgEl.textContent = erro.msg;
        msgEl.classList.add('visible');
      }
    });

    return valido;
  }

  function salvarAlimento(event) {
    event.preventDefault();
    const dados = {
      nome: document.getElementById('nome').value,
      categoria: document.getElementById('categoria').value,
      marca: document.getElementById('marca').value,
      lote: document.getElementById('lote').value,
      codigoInterno: document.getElementById('codigo-interno').value,
      quantidade: document.getElementById('quantidade').value,
      unidade: document.getElementById('unidade').value,
      estoqueMinimo: document.getElementById('estoque-minimo').value,
      dataValidade: document.getElementById('data-validade').value,
      local: document.getElementById('local').value,
      dataEntrada: document.getElementById('data-entrada').value,
      preco: document.getElementById('preco').value,
      fornecedor: document.getElementById('fornecedor').value,
      observacoes: document.getElementById('observacoes').value
    };

    if (!validarFormularioAlimento(dados)) return;

    dados.quantidade = Number(dados.quantidade);
    dados.estoqueMinimo = dados.estoqueMinimo ? Number(dados.estoqueMinimo) : 0;
    dados.preco = dados.preco ? Number(dados.preco) : null;

    const alimentos = carregarAlimentos();
    const editId = document.getElementById('edit-id').value;

    if (editId) {
      const idx = alimentos.findIndex(a => a.id === editId);
      if (idx !== -1) {
        alimentos[idx] = { ...alimentos[idx], ...dados };
      }
      mostrarToast('Alimento atualizado com sucesso!');
    } else {
      dados.id = gerarId();
      dados.criadoEm = new Date().toISOString();
      alimentos.push(dados);
      mostrarToast('Alimento cadastrado com sucesso!');
    }

    salvarAlimentos(alimentos);
    limparFormulario();
    atualizarFiltrosDinamicos();
    document.querySelector('[data-tab="estoque"]').click();
  }

  function editarAlimento(id) {
    abrirModalCadastro(id);
  }

  function excluirAlimento(id) {
    if (!confirm('Tem certeza que deseja excluir este alimento e todas as suas movimentações?')) return;

    let alimentos = carregarAlimentos();
    alimentos = alimentos.filter(a => a.id !== id);
    salvarAlimentos(alimentos);

    let movimentacoes = carregarMovimentacoes();
    movimentacoes = movimentacoes.filter(m => m.alimentoId !== id);
    salvarMovimentacoes(movimentacoes);

    atualizarFiltrosDinamicos();
    renderizarEstoque();
    mostrarToast('Alimento excluído.');
  }

  /* ===== MODAL: MOVIMENTAÇÃO ===== */

  function abrirModalMovimentacao(alimentoId, movimentacaoId) {
    const alimentos = carregarAlimentos();
    const alimento = alimentos.find(a => a.id === alimentoId);
    if (!alimento) return;

    document.getElementById('mov-alimento-id').value = alimentoId;
    document.getElementById('mov-alimento-nome').textContent = `${alimento.nome} — Estoque atual: ${alimento.quantidade} ${alimento.unidade}`;
    document.getElementById('mov-edit-id').value = movimentacaoId || '';
    document.getElementById('modal-mov-titulo').textContent = movimentacaoId ? 'Editar Movimentação' : 'Registrar Movimentação';

    if (movimentacaoId) {
      const movimentacoes = carregarMovimentacoes();
      const m = movimentacoes.find(x => x.id === movimentacaoId);
      if (m) {
        document.getElementById('mov-tipo').value = m.tipo;
        document.getElementById('mov-quantidade').value = m.quantidade;
        document.getElementById('mov-data').value = m.data;
        document.getElementById('mov-responsavel').value = m.responsavel;
        document.getElementById('mov-motivo').value = m.motivo;
        document.getElementById('mov-obs').value = m.observacoes || '';
      }
    } else {
      document.getElementById('form-movimentacao').reset();
      document.getElementById('mov-data').value = obterHoje();
    }

    document.getElementById('modal-movimentacao').classList.add('open');
  }

  function fecharModalMov(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('modal-movimentacao').classList.remove('open');
    document.getElementById('form-movimentacao').reset();
    document.getElementById('mov-edit-id').value = '';
  }

  function salvarMovimentacao(event) {
    event.preventDefault();

    const alimentoId = document.getElementById('mov-alimento-id').value;
    const editId = document.getElementById('mov-edit-id').value;
    const tipo = document.getElementById('mov-tipo').value;
    const quantidade = Number(document.getElementById('mov-quantidade').value);
    const data = document.getElementById('mov-data').value;
    const responsavel = document.getElementById('mov-responsavel').value;
    const motivo = document.getElementById('mov-motivo').value;
    const observacoes = document.getElementById('mov-obs').value;

    if (!tipo || !quantidade || !data || !responsavel || !motivo) {
      mostrarToast('Preencha todos os campos obrigatórios.', 'erro');
      return;
    }

    if (quantidade <= 0) {
      mostrarToast('Quantidade deve ser maior que zero.', 'erro');
      return;
    }

    const alimentos = carregarAlimentos();
    const alimento = alimentos.find(a => a.id === alimentoId);
    if (!alimento) return;

    let movimentacoes = carregarMovimentacoes();

    if (editId) {
      const movAntiga = movimentacoes.find(m => m.id === editId);
      if (movAntiga) {
        if (movAntiga.tipo === 'entrada') {
          alimento.quantidade = Number(alimento.quantidade) - Number(movAntiga.quantidade);
        } else {
          alimento.quantidade = Number(alimento.quantidade) + Number(movAntiga.quantidade);
        }
      }

      if (tipo === 'saida' && Number(alimento.quantidade) < quantidade) {
        alimento.quantidade = Number(alimento.quantidade) + (movAntiga ? Number(movAntiga.quantidade) : 0);
        mostrarToast(`Estoque insuficiente. Disponível: ${alimento.quantidade} ${alimento.unidade}.`, 'erro');
        return;
      }

      if (tipo === 'entrada') {
        alimento.quantidade = Number(alimento.quantidade) + quantidade;
      } else {
        alimento.quantidade = Number(alimento.quantidade) - quantidade;
      }

      const idxMov = movimentacoes.findIndex(m => m.id === editId);
      if (idxMov !== -1) {
        movimentacoes[idxMov] = { ...movimentacoes[idxMov], tipo, quantidade, data, responsavel, motivo, observacoes };
      }
      mostrarToast('Movimentação atualizada!');
    } else {
      if (tipo === 'saida' && Number(alimento.quantidade) < quantidade) {
        mostrarToast(`Estoque insuficiente. Disponível: ${alimento.quantidade} ${alimento.unidade}.`, 'erro');
        return;
      }

      if (tipo === 'entrada') {
        alimento.quantidade = Number(alimento.quantidade) + quantidade;
      } else {
        alimento.quantidade = Number(alimento.quantidade) - quantidade;
      }

      movimentacoes.push({
        id: gerarId(),
        alimentoId,
        tipo,
        quantidade,
        data,
        responsavel,
        motivo,
        observacoes,
        criadoEm: new Date().toISOString()
      });
      mostrarToast('Movimentação registrada!');
    }

    const idxAlimento = alimentos.findIndex(a => a.id === alimentoId);
    if (idxAlimento !== -1) {
      alimentos[idxAlimento].quantidade = alimento.quantidade;
    }

    salvarAlimentos(alimentos);
    salvarMovimentacoes(movimentacoes);
    fecharModalMov();
    renderizarEstoque();
    renderizarAlertas();
  }

  function editarMovimentacao(movId) {
    const movimentacoes = carregarMovimentacoes();
    const m = movimentacoes.find(x => x.id === movId);
    if (m) {
      abrirModalMovimentacao(m.alimentoId, movId);
    }
  }

  function excluirMovimentacao(movId) {
    if (!confirm('Tem certeza que deseja excluir esta movimentação? O estoque será ajustado.')) return;

    const movimentacoes = carregarMovimentacoes();
    const m = movimentacoes.find(x => x.id === movId);
    if (!m) return;

    const alimentos = carregarAlimentos();
    const alimento = alimentos.find(a => a.id === m.alimentoId);

    if (alimento) {
      if (m.tipo === 'entrada') {
        alimento.quantidade = Number(alimento.quantidade) - Number(m.quantidade);
      } else {
        alimento.quantidade = Number(alimento.quantidade) + Number(m.quantidade);
      }
      if (alimento.quantidade < 0) alimento.quantidade = 0;
      salvarAlimentos(alimentos);
    }

    const novas = movimentacoes.filter(x => x.id !== movId);
    salvarMovimentacoes(novas);
    renderizarMovimentacoes();
    renderizarEstoque();
    renderizarAlertas();
    mostrarToast('Movimentação excluída e estoque ajustado.');
  }

  /* ===== DETALHES DO ALIMENTO ===== */

  function verDetalhe(alimentoId) {
    const alimentos = carregarAlimentos();
    const alimento = alimentos.find(a => a.id === alimentoId);
    if (!alimento) return;

    const movimentacoes = carregarMovimentacoes()
      .filter(m => m.alimentoId === alimentoId)
      .sort((a, b) => b.data.localeCompare(a.data) || b.criadoEm.localeCompare(a.criadoEm));

    const sv = statusValidade(alimento);
    const se = statusEstoque(alimento);
    const sg = statusGeral(alimento);

    document.getElementById('detalhe-titulo').textContent = alimento.nome;

    let html = `
      <div class="detalhe-actions">
        <button class="btn-primary btn-small" onclick="window.__app.abrirModalMovimentacao('${alimento.id}')">+ Movimentação</button>
        <button class="btn-secondary btn-small" onclick="window.__app.editarAlimento('${alimento.id}')">Editar</button>
        <button class="btn-danger btn-small" onclick="window.__app.excluirAlimento('${alimento.id}')">Excluir</button>
      </div>
      <div class="detalhe-grid">
        <div class="detalhe-item"><div class="label">Categoria</div><div class="value">${alimento.categoria}</div></div>
        <div class="detalhe-item"><div class="label">Quantidade</div><div class="value">${alimento.quantidade} ${alimento.unidade}</div></div>
        <div class="detalhe-item"><div class="label">Estoque mínimo</div><div class="value">${alimento.estoqueMinimo || 0} ${alimento.unidade}</div></div>
        <div class="detalhe-item"><div class="label">Status estoque</div><div class="value"><span class="badge badge-${se}">${labelStatus(se === 'ok' ? sg : se)}</span></div></div>
        <div class="detalhe-item"><div class="label">Validade</div><div class="value">${formatarData(alimento.dataValidade)}</div></div>
        <div class="detalhe-item"><div class="label">Status validade</div><div class="value"><span class="badge badge-${sv}">${labelStatus(sv)}</span></div></div>
        <div class="detalhe-item"><div class="label">Local</div><div class="value">${alimento.local}</div></div>
        ${alimento.marca ? `<div class="detalhe-item"><div class="label">Marca</div><div class="value">${alimento.marca}</div></div>` : ''}
        ${alimento.lote ? `<div class="detalhe-item"><div class="label">Lote</div><div class="value">${alimento.lote}</div></div>` : ''}
        ${alimento.codigoInterno ? `<div class="detalhe-item"><div class="label">Código Interno</div><div class="value">${alimento.codigoInterno}</div></div>` : ''}
        ${alimento.dataEntrada ? `<div class="detalhe-item"><div class="label">Data de Entrada</div><div class="value">${formatarData(alimento.dataEntrada)}</div></div>` : ''}
        ${alimento.preco ? `<div class="detalhe-item"><div class="label">Preço</div><div class="value">${formatarMoeda(alimento.preco)}</div></div>` : ''}
        ${alimento.fornecedor ? `<div class="detalhe-item"><div class="label">Fornecedor</div><div class="value">${alimento.fornecedor}</div></div>` : ''}
        ${alimento.observacoes ? `<div class="detalhe-item"><div class="label">Observações</div><div class="value">${alimento.observacoes}</div></div>` : ''}
      </div>

      <div class="detalhe-section">
        <h4>Histórico de Movimentações (${movimentacoes.length})</h4>`;

    if (movimentacoes.length === 0) {
      html += '<div class="vazio">Nenhuma movimentação registrada.</div>';
    } else {
      html += movimentacoes.map(m => {
        const tipoLabel = m.tipo === 'entrada' ? '➕ Entrada' : '➖ Saída';
        return `
          <div class="card-movimentacao tipo-${m.tipo}" style="margin-bottom:8px;">
            <div class="card-info">
              <div class="card-meta">
                <span>${tipoLabel}</span>
                <span>${m.quantidade} ${alimento.unidade}</span>
                <span>${formatarData(m.data)}</span>
                <span>${m.responsavel}</span>
                <span>${m.motivo}</span>
                ${m.observacoes ? `<span>${m.observacoes}</span>` : ''}
              </div>
            </div>
            <div class="card-actions">
              <button class="btn-secondary btn-small" onclick="window.__app.editarMovimentacao('${m.id}')">Editar</button>
              <button class="btn-danger btn-small" onclick="window.__app.excluirMovimentacao('${m.id}')">Excluir</button>
            </div>
          </div>`;
      }).join('');
    }

    html += '</div>';

    document.getElementById('detalhe-conteudo').innerHTML = html;
    document.getElementById('modal-detalhe').classList.add('open');
  }

  function fecharModalDetalhe(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('modal-detalhe').classList.remove('open');
  }

  /* ===== EVENTOS ===== */

  function bindEvents() {
    document.getElementById('form-alimento').addEventListener('submit', salvarAlimento);
    document.getElementById('form-movimentacao').addEventListener('submit', salvarMovimentacao);

    document.getElementById('busca-geral').addEventListener('input', renderizarEstoque);
    document.getElementById('filtro-categoria').addEventListener('change', renderizarEstoque);
    document.getElementById('filtro-marca').addEventListener('change', renderizarEstoque);
    document.getElementById('filtro-local').addEventListener('change', renderizarEstoque);
    document.getElementById('filtro-fornecedor').addEventListener('change', renderizarEstoque);
    document.getElementById('filtro-situacao').addEventListener('change', renderizarEstoque);
    document.getElementById('filtro-validade-inicio').addEventListener('change', renderizarEstoque);
    document.getElementById('filtro-validade-fim').addEventListener('change', renderizarEstoque);

    document.getElementById('busca-mov').addEventListener('input', renderizarMovimentacoes);
    document.getElementById('filtro-tipo-mov').addEventListener('change', renderizarMovimentacoes);
    document.getElementById('filtro-motivo-mov').addEventListener('change', renderizarMovimentacoes);
    document.getElementById('filtro-data-inicio').addEventListener('change', renderizarMovimentacoes);
    document.getElementById('filtro-data-fim').addEventListener('change', renderizarMovimentacoes);
  }

  /* ===== INICIALIZAÇÃO ===== */

  function init() {
    initTabs();
    bindEvents();
    atualizarFiltrosDinamicos();
    renderizarEstoque();
    renderizarAlertas();
  }

  /* ===== API PÚBLICA (para onclick no HTML) ===== */

  window.__app = {
    abrirModalCadastro: () => abrirModalCadastro(),
    editarAlimento,
    excluirAlimento,
    abrirModalMovimentacao,
    editarMovimentacao,
    excluirMovimentacao,
    verDetalhe,
    limparFormulario,
    fecharModalMov,
    fecharModalDetalhe
  };

  document.addEventListener('DOMContentLoaded', init);
})();
