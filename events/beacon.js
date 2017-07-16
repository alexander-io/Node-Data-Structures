/*
 *
 * I like to think of event emitters as beacons
 *
 * you can establish functions to occur on a particular event, then you can cause that event to occur... it's an alternative way of thinking about function structure, imo\
 *
 * anyway, these beacons emit events (events are String type) and listeners will execute when the event occurs...
 *
 */


const EventEmitter = require('events')
const emitter = new EventEmitter();

beacon.addListener('flash', () => {
  console.log('flash of light');
})

beacon.addListener('knock', () => {
  console.log('knock knock knock');
})

beacon.addListener('swush', () => {
  console.log('swooooooooosh in the wind');
})

let lst = ['flash', 'knock', 'swush']
lst.forEach((event) => {
  beacon.emit(event)
})
