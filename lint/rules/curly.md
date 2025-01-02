---
tags: []
---

Enfore consistent brace style for all control statements.

**Invalid:**

```ts
if (foo) bar;

if (foo) {
  bar;
} else baz;

while (foo) bar;

do bar; while (foo);

for (let i = 0; i < 10; i++) bar;

for (a in b) bar;

for (const a of b) bar;
```

**Valid:**

```ts
if (foo) {
  bar;
}

if (foo) {
  bar;
} else {
  baz;
}

while (foo) {
  bar;
}

do {
  bar;
} while (foo);

for (let i = 0; i < 10; i++) {
  bar;
}

for (a in b) {
  bar;
}

for (const a of b) {
  bar;
}
```
