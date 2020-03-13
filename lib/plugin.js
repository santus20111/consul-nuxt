/* eslint-disable new-cap,no-console */
import Consul from "consul/lib";
import yaml from "js-yaml";
export default async ({ app, store }) => {
    if(process.server) {
        const props = {
            host: '<%= options.host %>',
            port: '<%= options.port %>',
            name: '<%= options.name %>',
            config: '<%= options.config %>',
            serverHost: '<%= options.serverHost %>',
            serverPort: '<%= options.serverPort %>',
            debug: '<%= options.debug %>'
        }
        const consul = Consul({host: props.host, port: +props.port})
        let consulEnv = {config: {}}
        let config = {}
        for (const configPath of props.config.split(',')) {
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
                try {
                    config[configPath] = JSON.parse(value.Value)
                } catch (e) {
                    config[configPath]= yaml.load(value.Value);
                }
            }
        }
        consulEnv.config = config
        store.state.consul = consulEnv
    }
}
