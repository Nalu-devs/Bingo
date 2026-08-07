# Contrato de API do ScoreManager

Este arquivo é o **contrato de referência** do módulo `src/core/ScoreManager.js`.
Toda mudança em `src/core/**` deve respeitar este contrato.

## Chave de storage

A constante `STORAGE_KEY` deve ter o valor exato `arcadehub_scores`.

## Schema persistido (formato do objeto salvo em localStorage)

Os nomes de campos abaixo são **imutáveis** (não podem ser renomeados, removidos
ou ter o tipo alterado), pois são consumidos por `src/games/**`, `src/games/stats/StatsPage.js`,
`src/games/home/HomePage.js` e testes em `src/__tests__/`.

```json
{
  "velha":   { "X": 0, "O": 0, "Y": 0, "draws": 0 },
  "forca":   { "wins": 0, "losses": 0 },
  "jokenpo": { "wins": 0, "losses": 0, "draws": 0 },
  "memoria": { "wins": 0, "losses": 0, "bestScore": 0 }
}
```

## Campos imutáveis

- `velha`: `X`, `O`, `Y`, `draws`
- `forca`: `wins`, `losses`
- `jokenpo`: `wins`, `losses`, `draws`
- `memoria`: `wins`, `losses`, `bestScore`

Qualquer renomeação, remoção ou mudança de tipo (ex.: `bestScore` deixar de ser número)
desses campos é uma **violação de contrato**.

## API pública (métodos obrigatórios)

- `get(game)` -> objeto do schema para `game`
- `update(game, updates)` -> faz merge (`Object.assign`) dos `updates` no objeto de `game` e persiste
- `reset(game)` -> zera `game` para o default do schema e persiste
- `resetAll()` -> zera todos os jogos e persiste
- `getAll()` -> cópia de todo o schema

Remover, renomear ou mudar a assinatura de qualquer um desses métodos também é
**violação de contrato**.
