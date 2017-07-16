/*
 * a single instance of nodejs runs in a single thread, to take advantage of multicore systems the user will want to launch a cluster of nodejs processes to handle the load
 *
 * the cluster module allows easy creation of child processes that all share server ports
 */
 const cluster = require('cluster')
 const http = require('http')
 const numCPUs = require('os').cpus().length



 if (cluster.isMaster) {

   let num_requests = 0
   let lst_of_ips = {}
   let clustr = {}


   let messageHandler = function(message) {
     if (message.cmd && message.cmd === 'notifyRequest') {
       num_requests += 1
     }

     if (message.ip && message.pid) {

       if (!clustr[message.pid]) {
          clustr[message.pid] = {}
       }

      //  clustr[message.pid].push(lst_of_ips)
      // clustr[message.pid][message.ip] = (new Date()).toLocaleTimeString('minute')

      clustr[message.pid][(new Date()).toLocaleTimeString('minute')] = message.ip 


      // lst_of_ips[message.ip] = (new Date()).toLocaleTimeString()
     }
    //  console.log(lst_of_ips);
     console.log(clustr);
   }

   console.log('master '+ process.pid +' is running');

   // fork workers
   for (let i = 0; i < numCPUs; i++) {
     cluster.fork()
   }

   // when a cluster hears a 'message' event, call the message handler
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
     process.send({cmd : 'notifyRequest', ip : req.connection.remoteAddress, pid : process.pid})

   }).listen(8000)
   console.log('worker ' + process.pid + ' started');
  }
