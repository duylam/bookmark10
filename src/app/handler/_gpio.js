import {Gpio} from 'onoff'
import BPromise from 'bluebird'

export default class _Gpio {
  constructor(pin) {
    this._gpio = new Gpio(pin, 'in')
    this._previousValue = null
  }

  read() {
    return new BPromise((resolve, reject) => {
      this._gpio.read((err, value) => {
        if (err) return reject(err)

        const previous = this._previousValue === null ? value : this._previousValue 
        this._previousValue = value

        resolve({value, previous})
      })
    })
  }
}
