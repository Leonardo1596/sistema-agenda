import { Request, Response, NextFunction } from 'express'

export function roleMiddleware(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user

    if (!user || !user.roles) {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    const hasRole = user.roles.some((role: string) =>
      allowedRoles.includes(role)
    )

    if (!hasRole) {
      return res.status(403).json({ error: 'Permissão insuficiente' })
    }

    next()
  }
}
