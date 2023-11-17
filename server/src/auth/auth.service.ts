import {
  Body,
  Injectable,
  Post,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs'; // Заміни bcrypt на bcryptjs
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('registration')
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserDto: CreateUserDto) {
    // Хешуємо пароль перед збереженням
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10); // 10 - кількість раундів хешування

    // Замість зберігання пароля в чистому вигляді, зберігаємо хеш
    const user = await this.userService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });

    return user;
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email);

    if (user) {
      const passwordIsMatch = await bcrypt.compare(password, user.password);

      if (passwordIsMatch) {
        return user;
      }
    }

    throw new UnauthorizedException('User or password are incorrect!');
  }

  async login(user) {
    const { id, email } = user;
    return {
      id,
      email,
      token: this.jwtService.sign({ id: user.id, email: user.email }),
    };
  }
}
