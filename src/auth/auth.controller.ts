import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Ruta no protegida - Todos los clientes o usuarios pueden hacer login
  @Post('/register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  // Ruta no protegida - Todos los clientes se pueden registrar
  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  // Ruta o End Point protegido que requiera un Token
  // Para ver el perfil de un usuario, se requiere su token
  // El Guard Crea el objeto user y lo anexa a la solicitud
  @UseGuards(AuthGuard)
  @Get('/profile')
  profile(@Request() req) {
    return 'Estas viendo el perfil protegido por un token valido del usuario: ' + req.user.name ;
  }

}
