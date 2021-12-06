const path = require('path');
const CONFIG_KEY = 'nuxt-directus-ts';
const nuxtModule = function (moduleOptions) {
    console.log(CONFIG_KEY, { moduleOptions });
    const options = {
        ...this.options['nuxt-directus-ts'],
        ...moduleOptions
    };
    const runtimeDir = path.resolve(__dirname, 'runtime');
    this.nuxt.options.alias['~nuxt-directus-ts'] = runtimeDir;
    this.nuxt.options.build.transpile.push(runtimeDir);
    // this.addPlugin({
    //   src: path.resolve(runtimeDir, 'plugin.mjs'),
    //   fileName: 'nuxt-directus-ts.js',
    //   options
    // })
};
nuxtModule.meta = require('../package.json');
export default nuxtModule;
