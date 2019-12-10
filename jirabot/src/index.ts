import Bot from './bot'
import {init} from './context'
import * as BotConfig from './bot-config'
import http from 'http'
import logger from './logger'

const handleElbHealthCheck = () =>
  http
    .createServer((req, res) => {
      try {
        if (req.url === '/jirabot') {
          res.write('ok')
          res.end()
          return
        }
        res.writeHead(404)
        res.write('not found')
        res.end()
      } catch {}
    })
    .listen(8080)

const botConfig = BotConfig.parse(process.env.JIRABOT_CONFIG || '')
if (!botConfig) {
  logger.fatal('invalid bot-config')
  process.exit(1)
} else {
  handleElbHealthCheck()
  init(botConfig).then(Bot)
}