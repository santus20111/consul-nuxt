/* eslint-disable no-console */
import Consul from 'consul'
import path from 'path'

export default function (moduleOptions) {
    if (moduleOptions.name) {
        this.addServerMiddleware(path.resolve(__dirname, 'middleware.js'))
        let debug = !!moduleOptions.debug
        const props = {
            host: moduleOptions.host ? moduleOptions.host : '127.0.0.1',
            port: moduleOptions.port ? +moduleOptions.port : 8500,
            name: moduleOptions.name,
            config: moduleOptions.config ? moduleOptions.config : [],
            serverHost: moduleOptions.serverHost
                ? moduleOptions.serverHost
                : this.options.server.host,
            serverPort: moduleOptions.serverHost
                ? +moduleOptions.serverPort
                : +this.options.server.port,
            debug: debug
        }
        this.nuxt.hook('listen', async (server, {host, port}) => {
            const consul = Consul({host: props.host, port: props.port})
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
                    if(props.debug) {
                        if (error) {
                            console.error('consul register error')
                            console.error(error)
                            console.log(body)
                            console.log(res)
                        } else {
                            console.log('module registered in consul')
                        }
                    }
                }
            )
        })
        this.addPlugin({
            src: path.resolve(__dirname, 'plugin.js'),
            options: props
        })
    } else {
        console.error('module consul error, name not found')
    }
}
module.exports.meta = require('../package.json') // ?? todo error
