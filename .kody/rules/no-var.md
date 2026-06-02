---
title: "No var usage - use const or let"
scope: "file"
path: ["src/**/*.js"]
severity_min: "medium"
languages: ["javascript"]
buckets: ["style-conventions"]
enabled: true
---

## Instructions
Check for `var` declarations in JavaScript files.
- `var` should not be used in modern JavaScript code
- Use `const` for values that don't change
- Use `let` for values that change

## Examples

### Bad example
```javascript
var nome = "João";
var idade = 30;
var count = 0;
for (var i = 0; i < 10; i++) {
  console.log(i);
}
```

### Good example
```javascript
const nome = "João";
let idade = 30;
let count = 0;
for (let i = 0; i < 10; i++) {
  console.log(i);
}
```

@kody-sync
