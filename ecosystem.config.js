module.exports = {
  apps: [{
    name: 'promise-erp',
    script: 'node_modules/.bin/next',
    args: 'start -p 3002',
    exec_mode: 'cluster',    // Run in Cluster mode for zero-downtime reloads
    instances: 'max',        // Scale instances based on CPU cores (e.g. 2 cores)
    env: {
      NODE_ENV: 'production'
    }
  }]
}
