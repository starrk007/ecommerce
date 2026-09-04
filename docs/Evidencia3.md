# Evidencia 3
### Alexis Andrei Razo Armenta
### 148255
### 30/08/26

<br>

## Actividades Hechas en clase

### 1. Codigo
#### async-handler.js
```javascript
export function asyncHndler(handler) {
    return function wrappedHandler(
        req,
        res,
        next
    ) {
        Promise.resolve(
            handler(req, res, next)
        ).catch(next);
    }
}

```

#### validate.middleware.js
```javascript
import { ZodError} from 'zod';
import { AppError } from '../errors/app-error';

export function validate(schema) {
    return function validateMiddleware(
        req, _res, next
    ) {
        try{
            const result = schema.parse({
                body: req.body,
                params: req.params,
                query: req.query
            })
            req.validated = result;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                new AppError({
                    statusCode: 400,
                    code: 'VALIDATION_ERROR',
                    message: 'Request validation failed',
                    details: error.issues
                });
            }
        }
    }
}

```

#### error.middleware.js
```javascript
import { env } from "../../config/env.js";
import { AppError } from "../errors/app-error.js";

export function errorMiddleware(err, req, res, _next) {
    if (err instanceof AppError) {
        logger.warm({
            code: err.code,
            requestId: req.id,
            method: req.method,
            url: req.originalUrl,
            details: err.details
        }, err.message)
        return res.status(err.statusCode)
            .json({
                success: false,
                error: {
                    code: err.code,
                    message: err.message,
                    ...(err.details ? { details: err.details } : {})
                },
                meta: {
                    requestId: req.id
                }
            })
    }


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

#### app-error.js
```javascript
export class AppError extends Error {
    constructor ({
        statusCode,
        code,
        message,
        details
    }) {
        super(message);
        this.name = 'AppError'
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
    }
}

```

