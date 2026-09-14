import { permissionsByRole } from '../../config/permissions.js';
import { AppError } from '../errors/app-error.js';

export function authorize(permissions) {
    return function autorizeMiddleware(req, _res, next) {
        const role = req.auth?.role
        const permissions = permissionsByRole[role]
        if (!permissions || (!permissions.has('*') && !permissions.has(permissions))) {
            return next(new AppError({
                statusCode: 403,
                code: 'FORBIDEN',
                message: 'No tiene permisos para realizar la operacion'
            }))
        }
    return next()
    }
}
