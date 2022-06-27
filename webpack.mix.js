const mix = require('laravel-mix');

mix.options({
  processCssUrls: false,
});

mix.js('src/app.js', 'js')
  .js('src/sim.worker.js', 'js')
  .sass('src/assets/sass/app.scss', 'css')
  .setPublicPath('dist')
  .vue({ version: 2 });
