---
title: "No console.log in production code"
scope: "file"
path: ["src/**/*.js"]
severity_min: "medium"
languages: ["javascript"]
buckets: ["style-conventions"]
enabled: true
---

## Instructions
Check for `console.log` statements in production JavaScript files.
- Console logs should not appear in production code
- Remove console.log before committing
- Use proper logging if needed

## Examples

### Bad example
```javascript
function processUser(user) {
  console.log('Processing user:', user.id);
  return user.process();
}
```

### Good example
```javascript
function processUser(user) {
  return user.process();
}
```

@kody-sync
