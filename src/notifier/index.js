import {createServer} from 'http'
import Speaker from 'speaker'
import {createReadStream} from 'fs'
import {join} from 'path'
import {fork} from 'child_process'

const config = {
  PORT: process.env.P10_PORT || 3000,
  ALARM_FILE: join(__dirname, 'alarm.wav'),
  FORKED: process.env.P10_FORKED
}

function launchServer() {
  const server = createServer((req, res) => {
    const speaker = new Speaker({
      channels: 1,
      bitDepth: 8,
      sampleRate: 11000
    })
    speaker
      .on('close', () => {
        res.statusCode = 200
        res.end()
      })
    createReadStream(config.ALARM_FILE).pipe(speaker)
  })

  server.listen(config.PORT, () => console.log(`Listening on ${config.PORT}`))
}

function forkMe() {
  // The `speaker` module isn't stable (at least on my OSX) and usually causes
  // app crashing. So it is run on a child process in order we can re-run again
  const cp = fork(__dirname, {env: {...process.env, P10_FORKED: 1}})
  cp.on('exit', () => {
    console.log('Forked child process exited. Forking new one ...')
    forkMe()
  })
}

if (config.FORKED) {
  launchServer()
}
else {
  forkMe()
  console.log('Forked a new child process')
}
