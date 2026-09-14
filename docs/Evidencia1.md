# Evidencia 1
### Alexis Andrei Razo Armenta
### 148255
### 16/08/26

<br>

## Actividades Hechas en clase

### 1. Desligar reporitorio para agregar uno propio
```bash
git remote -v
git remote remove origin
git remote add origin https://github.com/starrk007/ecommerce.git
```
### 2. Preparar entorno
```bash
npm init -y
npm init -w apps/api -y
npm init -w packages/contracts -y
npm init -w packages/config -y
npm init -w packages/shared -y 
```
### 3. Instalacion de dependencias

```bash
npm i express dotenv cors helmet pino pino-http --workspace=@ecommerce/api
npm i -D nodemon eslint @eslint/js globals pino-pretty --workspace=@ecommerce/api
```
### 4. Codigo
#### env.js
```javascript
import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const currentFile = fileURLToPath(import.meta.url)
const currentDirectory = path.dirname(currentFile)
const envPath = path.resolve(currentDirectory, '../../.env')

dotenv.config({
    path: envPath
})

const port = Number(process.env.PORT ?? 4000)

if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('El puerto debe de ser valido')
}

export const env = Object.freeze({
    NODE_ENV: process.env.NODE_ENV,
    PORT: port,
    API_PREFIX: process.env.API_PREFIX,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    LOG_LEVEL: process.env.LOG_LEVEL
})

```
#### logger.js
```javascript
import pino from 'pino'
import { env } from './env.js'

const transport =
    env.NODE_ENV === 'production' ? undefined : pino.transport
    ({
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname'
        }
    })

    export const logger = pino({
        level: env.LOG_LEVEL
    }, transport)
```
#### healt.controller.js
```javascript
import { env } from "../../config/env.js";

export function getHealth(req, res) {
    return res.status(200).json({
        success: true,
        data: {
            service: 'ecommerce-api',
            status: 'ok',
            environment: env.NODE_ENV,
            uptime: Number(process.uptime().toFixed(2)),
            timestamp: new Date().toISOString()
        },
        meta: {
            requestId: req.id
        }
    })
}
```
#### health.routes.js
```javascript
import { Router } from 'express'
import { getHealth } from './health.controller.js'

const healthRoutes = Router()

router.get('/', getHealth)

export default healthRoutes
```
#### index.js
```javascript
import { Router } from 'express'
import { healthRoutes } from '../modules/health/health.routes.js'

const router = Router()

router.get('/', healthRoutes)

export default router
```
#### error.middleware.js
```javascript
import { logger } from "../../config/logger.js";

export function errorMiddleware(err, req, res, _next) {
    logger.error({
        err,
        requestId: req.id,
        method: req.method,
        url: req.orignalUrl
    }, 'Unhandled application error')

    return res.status(500).json({
        success: false,
        error:{
            code: 'INTERNAL_SERVER_ERROR',
            message: process.env.NODE_ENV === 'production' ?
            'Internal Server Error' : err.message
        },
        meta: {
            requestId: req.id
        }
    })
}
```
#### not-found.middleware.js
```javascript
export function notFoundMiddleware(req, res) {
    return res.Status(404).json({
        success: false,
        error: {
            code: 'ROUTE_NOT_FOUND',
            message: `Route ${req.method} ${req.originalUrl} not found`
        },
        meta: {
            requestId: req.id
        }
    })
}
```

