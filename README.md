# express-formidable-typescript

Because `express-formidable` is no longer maintained, and the `formidable` version needs to be updated, so I a maintained typescript version here

## Install

```
npm install express-formidable-typescript
```

## How to use

```ts
import express from 'express';
import formidableMiddleware from 'express-formidable';

const app = express();

app.use(formidableMiddleware());

app.post('/upload', (req, res) => {
  req.fields; // contains non-file fields
  req.files; // contains files
});
```