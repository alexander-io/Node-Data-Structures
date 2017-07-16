const cluster = require('cluster')
const numCPUs = require('os').cpus().length

if (cluster.isMaster) {

  for (let i = 0; i < numCPUs; i++){
    cluster.fork()
  }

  // make the master listen for message from workers
  cluster.on('message', (worker, message, handle) => {
    if (message.code === 808 && message.pid) {
      console.log('root got message from fork pid:'+message.pid);
    }
  })

  // send a message to all of the workers every second
  setInterval(function(){
    for (fork in cluster.workers){
      cluster.workers[fork].send({code:808})
    }
  }, 1000)

} else {
  console.log('launching process ' + process.pid);

  // make each worker listen for a message
  cluster.worker.on('message', function(message){
    if(message.code === 808){
      // assign the workers pid to the message, send it to the root
      message.pid = process.pid
      process.send(message)
    }
  })
}
