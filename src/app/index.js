import {GPIO_MOTION_PIN, GPIO_PULLING_DURATION,
  NOTIFIER_HOSTNAME, NOTIFIER_PORT} from './config'
import Motion from './handler/motion'

const motion = new Motion(GPIO_MOTION_PIN, NOTIFIER_HOSTNAME, NOTIFIER_PORT)

scheduleNextRun()

console.log("Started and running ...")

function scheduleNextRun() {
  setTimeout(check, GPIO_PULLING_DURATION)
}

function check() {
  // ignore error
  motion.check()
    .catch(::console.error)
    .finally(scheduleNextRun)
}
