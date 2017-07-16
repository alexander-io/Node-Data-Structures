/*
 * a single instance of nodejs runs in a single thread, to take advantage of multicore systems the user will want to launch a cluster of nodejs processes to handle the load
 *
 * the cluster module allows easy creation of child processes that all share server ports
 */
 const cluster = require('cluster')
 const http = require('http')
 const numCPUs = require('os').cpus().length

 if (cluster.isMaster) {
   console.log('master ${process.pid} is running');

   // fork workers
   for (let i = 0; i < numCPUs; i++) {
     cluster.fork()
   }

   cluster.on('exit', (worker, code, signal) => {
     console.log('worker ${worker.process.pid} died');
   })
 } else {
   // workers can share any tcp connection
   // in this case it is an http server
   http.createServer((req, res) => {
     res.writeHead(200)
     res.end('hello world')
   }).listen(8000)
   console.log('worker ${process.pid} started');
  }
