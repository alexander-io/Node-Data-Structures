/*
 * a single instance of nodejs runs in a single thread, to take advantage of multicore systems the user will want to launch a cluster of nodejs processes to handle the load
 *
 * the cluster module allows easy creation of child processes that all share server ports
 */
 const cluster = require('cluster')
 const http = require('http')
 const numCPUs = require('os').cpus().length

 if (cluster.isMaster) {


   // keep track of http requests
   let num_requests = 0
   setInterval(() => {
     console.log('requests :', num_requests);
   }, 5000)


   let messageHandler = function(message) {
     if (message.cmd && message.cmd === 'notifyRequest') {
       num_requests += 1
     }
   }

   console.log('master '+ process.pid +' is running');

   // fork workers
   for (let i = 0; i < numCPUs; i++) {
     cluster.fork()
   }

   for (const id in cluster.workers) {
     cluster.workers[id].on('message', messageHandler)
   }


   cluster.on('exit', (worker, code, signal) => {
     console.log('worker ' + worker.process.pid + ' died');
   })

 } else {
   // workers can share any tcp connection
   // in this case it is an http server
   http.createServer((req, res) => {
     res.writeHead(200)
     res.end('hello world')

     console.log('worker :', process.pid + ', got request');

     // notify master about the request
     process.send({cmd : 'notifyRequest'})

   }).listen(8000)
   console.log('worker ' + process.pid + ' started');
  }
