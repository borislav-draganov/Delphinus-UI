import '../node_modules/material-design-lite/material.min.css';
import '../node_modules/material-design-lite/material.min.js';

import App from './App.svelte';
import './style.scss';

const app = new App({
    target: document.body,
});

export default app;