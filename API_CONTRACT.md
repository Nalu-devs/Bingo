# API Contract

Contrato oficial dos endpoints consumidos pelo frontend. Qualquer campo usado no
frontend deve existir neste documento.

## GET /api/stats

Retorna as estatisticas globais do jogador.

### Response body

```json
{
  "games": {
    "velha": {
      "winsX": 10,
      "winsO": 5,
      "draws": 3
    },
    "forca": {
      "wins": 7,
      "losses": 2
    },
    "jokenpo": {
      "wins": 4,
      "losses": 3,
      "draws": 1
    },
    "memoria": {
      "wins": 2,
      "losses": 1,
      "bestScore": 12
    }
  }
}
```

### Campos validos

| Caminho            | Tipo   |
| ------------------ | ------ |
| `games.velha.winsX` | number |
| `games.velha.winsO` | number |
| `games.velha.draws` | number |
| `games.forca.wins`  | number |
| `games.forca.losses`| number |
| `games.jokenpo.wins`| number |
| `games.jokenpo.losses` | number |
| `games.jokenpo.draws` | number |
| `games.memoria.wins`| number |
| `games.memoria.losses` | number |
| `games.memoria.bestScore` | number |
