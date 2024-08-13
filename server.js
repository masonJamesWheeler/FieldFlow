import { handler } from './build/handler.js';
import express from 'express';

const app = express();

// SvelteKit should handle everything else, including serving prerendered pages and static assets
app.use(handler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});