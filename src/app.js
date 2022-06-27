// Lodash
// Vue
import Vue from 'vue';

import App from './App.vue';

window._ = require('lodash');

require('./app.helpers');

const components = require.context('./components/', true, /\.vue$/i);
components.keys().map((key) => Vue.component(key.split('/').pop().split('.')[0], components(key).default));
const AppConstructor = Vue.extend(App);

// Init app
window.app = new AppConstructor({
  el: '#app',
});
