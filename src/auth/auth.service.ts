import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { NotFoundError } from 'rxjs';

@Injectable()
export class AuthService {
  // Para usar registrar la base de datos
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    // Desestructurar
    const numRound = 10;
    const{email, password} = createUserDto;

    // 1. Verificamos que no existe un usuario con el mismo correo
    const emailExiste = await this.userRepository.findOneBy( {email} );
    if (emailExiste){
      const error = {
        "statusCode": 409,
        "error": "Conflict",
        "message": ["El email ya existe"]
      }
      // Si se cumple la condicion, el usuario existe en la base de datos
      throw new ConflictException(error);
    }

    // 2. Encriptamos el password
    const hashPassword = await bcrypt.hash(password, numRound);
    createUserDto.password = hashPassword;

    // 3. Guardamos en base de datos
    return this.userRepository.save(createUserDto);

  }

  async login(loginUserDto: LoginUserDto) {
    const {email, password} = loginUserDto;

    // 1. Verificar que el email existe
    const emailExist = await this.userRepository.findOneBy( {email} );
    if (!emailExist) {
      const error = {
        "statusCode": 404,
        "error": "Not Found",
        "message": ["El usuario no existe"]
      }
      throw new NotFoundException(error);
    }

    // 2. Comparar la contraseñas que sean iguales
    const matchPassword = await bcrypt.compare(password, emailExist.password);
    if (!matchPassword) {
      const error = {
        "statusCode": 401,
        "error": "Unauthorized",
        "message": ["Contraseña incorrecta"]
      }    
      throw new UnauthorizedException(error);  
    }

    // 3. Regresar el token JWT 
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
