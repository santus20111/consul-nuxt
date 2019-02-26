/* eslint-disable no-console */
import Consul from 'consul'

export default async function(moduleOptions) {
  if (moduleOptions.name) {
    this.nuxt.hook('ready', async (nuxt) => {
      console.log('module consul loaded')
      const props = {
        host: moduleOptions.host ? moduleOptions.host : '127.0.0.1',
        port: moduleOptions.port ? +moduleOptions.port : 8500,
        name: moduleOptions.name,
        config: moduleOptions.config ? moduleOptions.config : [],
        serverHost: this.options.server.host,
        serverPort: +this.options.server.port,
        debug: !!moduleOptions.debug
      }

      let consulEnv = { config: {} }

      console.log('module consul register on host: ' + props.host + ' port: ' + props.port + ' applicationAddress: ' + props.serverHost + ':' + props.serverPort)

      const consul = Consul({ host: props.host, port: props.port })
      consul.agent.service.register(
        {
          name: props.name,
          id: props.name,
          address: props.serverHost,
          port: props.serverPort,
          check: {
            http: `http://${props.serverHost}:${props.serverPort}/health`,
            interval: '10s',
            timeout: '10s'
          }
        },
        (error, body, res) => {
          if(error) {
            console.error('consul register error')
            console.error(error)
            console.log(body)
            console.log(res)
          }
        }
      )

      let config = {}
      for (const configPath of props.config) {
        let value = await new Promise(resolve => {
          consul.kv.get(configPath, (err, result) => {
            if (err || result === undefined) {
              resolve(null)
            } else {
              resolve(result)
            }
          })
        })

        if (!value) {
          console.error(`config ${configPath} not found`)
        } else {
          config[configPath] = JSON.parse(value.Value)
          if(props.debug) {
            console.log(`config ${configPath}: ${config[configPath]}`)
          }
        }
      }

      consulEnv.config = config
      nuxt.options.env.consul = consulEnv
    })
  } else {
    console.error('module consul error, name not found')
  }

}
//module.exports.meta = require('../package.json') ?? todo error
