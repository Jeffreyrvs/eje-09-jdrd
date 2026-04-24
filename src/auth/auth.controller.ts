import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from './auth.guard';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Ruta no protegida - Todos los clientes se pueden registrar
  @ApiBody({type: CreateUserDto})
  @ApiCreatedResponse({type: User, description:'Cuando el registro es exitoso'})
  @ApiBadRequestResponse({description: 'Cuando falta enviar algun campo / El formato de email es incorrecto / Email no valido menos de 8 caracteres'})
  @ApiConflictResponse({description: 'Cuando se detecta un correo duplicado en base de datos'})
  @Post('/register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  // Ruta no protegida - Todos los clientes o usuarios pueden hacer login
  @ApiBody({type: LoginUserDto})
  @ApiCreatedResponse({
    description:'Acceso correcto',
    schema: {
      example: {
        token: 'token generado con jwt'
      }
    }
  })
  @ApiNotFoundResponse({description: 'Cuando el usuario no existe'})
  @ApiUnauthorizedResponse({description: 'Cuando la constrasena es incorrecta'})
  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  // Ruta o End Point protegido que requiera un Token
  // Para ver el perfil de un usuario, se requiere su token
  // El Guard Crea el objeto user y lo anexa a la solicitud
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({description:'Estas viendo el perfil protegido por un token valido del usuario: user'})
  @ApiUnauthorizedResponse({description:'Cuando falta el token de acceso'})
  @Get('/profile')
  profile(@Request() req) {
    return 'Estas viendo el perfil protegido por un token valido del usuario: ' + req.user.name ;
  }

}
