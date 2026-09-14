# Evidencia 6
### Alexis Andrei Razo Armenta
### 148255
### 13/09/26

<br>

## Actividades Hechas en clase

### 1. Codigo
#### auth.routes.js
```javascript
import { Router } from 'express';
import { login, refresh, register } from './auth.controller.js';
import { registerSchema, loginSchema, refreshSchema } from './auth.schema.js';
import { asyncHandler } from '../../shared/http/async-handler.js';
import { validate } from '../../shared/middleware/validate.middleware.js';

const router = Router();

router.post('/register', validate(registerSchema), asyncHandler(register));
router.post('/login', validate(loginSchema), asyncHandler(login));
router.post('/refresh', validate(refreshSchema), asyncHandler(refresh));

export default router

```

#### auth.controller.js
```javascript
import * as authService from './auth.service.js';

export async function register (req, res) {
    const data = await authService.register(req.body)

    return res. status(201).json({
        success: true,
        data,
        meta: {
            requestId: req.id
        }
    })
}

export async function login (req, res) {
    const data = await authService.login(req.validated.body)

    return res. status(200).json({
        success: true,
        data,
        meta: {
            requestId: req.id
        }
    })
}

export async function refresh (req, res) {
    const data = await authService.refresh(req.validated.body.refreshToken)

    return res. status(200).json({
        success: true,
        data,
        meta: {
            requestId: req.id
        }
    })
}

```

#### authenticate.middleware.js
```javascript
import { AppError } from "../errors/app-error.js";
import { verifyAccessToken } from "../security/tokens.js";

export function authenticate(req, _res, next) {
    const authorization = req.headers.authorization

    if (!authorization || !authorization.startWith('Bearer ')) {
        throw new AppError({
            statusCode: 401,
            code: 'AUTH_REQUIRED',
            message: 'Autenticación requerida'
        })
    }

    const token = authorization.slice(7);
    try {
        const payload = verifyAccessToken(token);
        req.auth = {
            userId: payload.sub,
            role: payload.role
        }
        return next();
    } catch {
        return next(
            new AppError({
                statusCode: 401,
                code: 'INVALID_ACCESS_TOKEN',
                message: 'Access Token Invalid'
            })
        );
    }
}

```

#### user.controller.js
```javascript
import { AppError } from '../../shared/errors/app-error.js';
import * as userRepository from './user.repository.js';

export async function me (req, res) {
    const user = await userRepository.findById(req.auth.userId);
    if (!user) {
        throw new AppError({
            statusCode: 404,
            code: 'USER_NOT_FOUND',
            message: 'Usuario no encontrado'
        })
    }
    return res.statatus(200).json({
        success: true,
        data: user,
        meta: {
            requestId: req.id
        }
    })
}

```

#### user.routes.js
```javascript
import { Router } from 'express';
import { me } from './user.controller.js';
import { asyncHandler } from '../../shared/http/async-handler.js';
import { authenticate } from '../../shared/middleware/authenticate.middleware.js';

const router = Router();

router.get('/me', authenticate, asyncHandler(me));
export default router;

```

#### index.js
```javascript
import { Router } from 'express'

import healthRoutes from './../modules/health/health.routes.js'
import productRoutes from './../modules/products/product.routes.js'
import authRoutes from './../modules/auth/auth.routes.js'
import userRoutes from './../modules/users/user.routes.js'

const router = Router()

router.use('/health', healthRoutes)
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/products', productRoutes)

export default router

```

#### auth.service.js
```javascript
import { AppError } from '../../shared/errors/app-error.js'
import { hashPassword, verifyPassword } from '../../shared/security/password.js'
import { signAccessToken, signRefreshToken, hashToken, verifyRefreshToken } from '../../shared/security/tokens.js'
import * as userRepository from '../users/user.repository.js'
import * as authRepository from './auth.repository.js'

function issueTokens(user) {
    const payload = {
        sub: user.id,
        role: user.role
    }
    return {
        accessToken: signAccessToken(payload),
        refreshToken: signRefreshToken(payload)
    }
}

export async function register (data) {
    const existingUser = await userRepository.findByEmail(data.email)
    if (existingUser) {
        throw new AppError({
            statusCode: 409,
            code: 'EMAIL_EXISTS',
            message: 'El correo ya fue registrado'
        })
    }
    const user = userRepository.createUser({
        name: data.name,
        email: data.email,
        passwordHash: await hashPassword(data.password),
        role: 'CUSTOMER',
        active: true
    })
    const tokens = issueTokens(user)
    await authRepository.saveRefreshToken({
        userId: user.id,
        tokenHash: hashToken(tokens.refreshToken)
    })
    return {
        user,
        ...tokens
    }
}

export async function login (data) {
    const user = userRepository.findByEmail(data.email)

    if(!user) {
        throw new AppError({
            statusCode: 401,
            code: 'INVALID_CREDENTIALS',
            message: 'Credenciales inválidas'
        })
    }

    const validPassword = await verifyPassword(data.password, user.passwordHash)

    if(!validPassword || !user.active){
        throw new AppError({
            statusCode: 401,
            code: 'INVALID_CREDENTIALS',
            message: 'Credenciales inválidas'
        })
    }

    const tokens = issueTokens(user)

    await  authRepository.saveRefreshToken({
        userId: user.id,
        tokenHash: hashToken(tokens.refreshToken)
    })

    return {
        user,
        ...tokens
    }
}

export async function refresh (refreshToken) {
    let payload
    try {
        payload = verifyRefreshToken(refreshToken)
    } catch {
        throw new AppError({
            statusCode: 401,
            code: 'INVALID_TOKEN',
            message: 'Token inválido'
        })
    }
    const tokenHash = hashToken(refreshToken)
    const storedToken = await authRepository.findRefreshToken(tokenHash)
    if (!storedToken || storedToken.revoked || storedToken.userId !== payload.sub) {
        throw new AppError({
            statusCode: 401,
            code: 'INVALID_TOKEN',
            message: 'Token inválido'
        })
    }

    await authRepository.revokeRefreshToken(tokenHash)
    const user = await userRepository.findById(payload.sub)
    if (!user || !user.active) {
        throw new AppError({
            statusCode: 401,
            code: 'USER_DISABLED',
            message: 'Usuario no disponible'
        })
    }

    const tokens = issueTokens(user)
    await authRepository.saveRefreshToken({
        userId: user.id,
        tokenHash: hashToken(tokens.refreshToken)
    })
    return tokens
}

```
