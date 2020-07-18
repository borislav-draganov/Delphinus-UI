import './style.scss';

import '../node_modules/material-design-lite/material.min.css';
import 'material-design-lite/material.min.js';
import App from './App.svelte';

const app = new App({
    target: document.body,
});

export default app;