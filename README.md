# consul-nuxt
Basic integration of consul.io for Nuxt.js
for install: npm i consul-nuxt

basic configuration in nuxt.config.js:
module.exports = {
  modules: [
    ['consul-nuxt', { host: '127.0.0.1', port: 8500, name: 'auth-front', config: ['public'], debug: true }]
  ]
}

properties: 
  1. host - consul host | default '127.0.0.1'
  2. port - consul port | default 8500
  3. name - name of your service, which will be registered | required
  4. config - array of values from k/v of consul, for example i have json string in consul k/v with name "public". theese configs adds to process.env.consul.config. in my situation it is process.env.consul.config.public | default []
  5. debug - enables debugging console output | default false
