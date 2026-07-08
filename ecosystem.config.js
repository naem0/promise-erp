module.exports = {
  apps: [{
    name: 'promise-erp',
    script: 'node_modules/.bin/next',
    args: 'start -p 3002',
    exec_mode: 'cluster',    // Run in Cluster mode for zero-downtime reloads
    instances: 2,           // Set to 2 instances to save RAM (takes ~300-400MB) while maintaining zero-downtime
    env: {
      NODE_ENV: 'production'
    }
  }]
}
