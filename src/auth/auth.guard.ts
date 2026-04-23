import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private jwtService: JwtService) {

  }

  async canActivate(context: ExecutionContext,): Promise<boolean> {
      // Aqui vamos a manejar la lógica de verificar 

      // 1. Que se esta enviando un token
      // 1.1 Obtener la solicitud del cliente
      const request = context.switchToHttp().getRequest();
      // 1.2 Obtener el token
      const token = this.extractTokenFromHeader(request);

      // 2. Que ese token es valido (este completo, que no este caducado, etc)
      // 2.1 Verficar que si se mandó el token
      if (!token) {
        throw new UnauthorizedException('Falta el token requerido. Acceso invalido');
      }

      //2.2 Verificar que si sea un token valido
      try {
        // paylooad = Carga util
        const payload = await this.jwtService.verifyAsync(token);
        // Agregamos a nuestra solicitud el usuario que verificamos
        request['user'] = payload;
      } catch {
        throw new UnauthorizedException('Token expirado o invalido');
      }

      return true;
  }

  // Verificar si la solicitud trae el token
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

}
