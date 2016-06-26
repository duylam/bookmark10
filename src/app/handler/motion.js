import {connect} from 'net'
import {get} from 'http'
import BPromise from 'bluebird'

import Gpio from './_gpio'

export default class Motion {
  constructor(pin, notifierHostname, notifierPort) {
    this._gpio = new Gpio(pin)
    this._notifierHostname = notifierHostname
    this._notifierPort = notifierPort
    this._stopAlert = null
    this._noOp = false
  }

  check() {
    if (this._noOp) return BPromise.resolve()

    return this._gpio
      .read()
      .then(({value}) => {
        if (value === 1) {
          // detected moving object
          this._stopAlert && this._stopAlert()
          this._stopAlert = this._startAlert()

          // The motion sensor recognizes (return 1) immediately the moving object
          // when it is in the scanning area. But when the object moved out of the
          // scanning area, the sensor still reports the object available (`1` value)
          // after a while (few seconds). This means the sensor still says
          // the object is there while it has been gone
          // To overcome this issue, once the sensor found moving object, we won't
          // read from it within a duration as the returned data isn't correct
          this._noOp = true
          setTimeout(() => this._noOp = false, 5000) // enable reading sensor
        }
        else {
          // moving object not found, stop once
          if (this._stopAlert) {
            this._stopAlert()
            this._stopAlert = null
          }
        }
      })
  }

  _startAlert() {
    let run = true
    let count = 0 // notifying times

    const notify = () => {
      ++count
      get(`http://${this._notifierHostname}:${this._notifierPort}`, notifyAgain)
        .on('error', (err) => {
          console.error(err)

          if (err.code && err.code === 'ECONNREFUSED') return // Notifier server is unavailable

          --count // ignore on error
          notifyAgain() // Notifier server crashed but it will be back, re-try again
        })
    }

    const notifyAgain = () => {
      // notify many times
      (run && count < 2) && setTimeout(notify, 1000)
    }

    notify()

    return function() {
      run = false
    }
  }
}
