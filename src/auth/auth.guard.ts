import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private jwtService: JwtService) {

  }

  canActivate(
    context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {
      // Aqui vamos a manejar la lógica de verificar 
      // 1. Que se esta enviando un token
      // 2. Que ese token es valido (este completo, que no este caducado, etc)
      
      return true;
  }
}
