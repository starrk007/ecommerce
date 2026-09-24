# Evidencia 6
### Alexis Andrei Razo Armenta
### 148255
### 16/09/26

<br>

## Actividades Hechas en clase

### 1. Codigo
#### permissions.js
```javascript
export const permissionsByRole =
    Object.freeze({
        CUSTOMER: new Set([
            'products: read',
            'orders: create',
            'orders: read-own',
        ]),
        ADMIN: new Set([
            'products: read',
            'products: create',
            'products: update',
            'products: delete',
            'users: read',
            'orders: read',
            'orders: update',
        ]),
        SUPER_ADMIN: new Set([
            '*'
        ]),
    })

```

#### promote-admin.js
```javascript
import {
  db
} from '../src/config/firebase.js'

const email =
  process.argv[2]

if (!email) {
  console.error(
    'Uso: node apps/api/scripts/promote-admin.js correo@dominio.com'
  )

  process.exit(1)
}

const snapshot =
  await db
    .collection('users')
    .where(
      'email',
      '==',
      email.toLowerCase()
    )
    .limit(1)
    .get()

if (snapshot.empty) {
  console.error(
    'Usuario no encontrado'
  )

  process.exit(1)
}

await snapshot.docs[0]
  .ref
  .update({
    role:
      'ADMIN'
  })

console.log(
  `Usuario ${email} promovido a ADMIN`
)

process.exit(0)

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
