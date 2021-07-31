import { UserStatus } from '@admin/access/users/user-status.enum';
import { UserEntity } from '@admin/access/users/user.entity';
import { ErrorType } from '@common/enums';
import {
  DisabledUserException,
  InvalidCredentialsException
} from '@common/exeptions';
import { UsersRepository } from '@modules/admin/access/users/users.repository';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './dtos';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersRepository)
    private userRepository: UsersRepository,
    private consigService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: consigService.get('TOKEN_SECRET'),
    });
  }

  async validate({ address }: JwtPayload): Promise<UserEntity> {
    const user = await this.userRepository.findUserByAddress(address);
    if (!user) {
      throw new InvalidCredentialsException();
    }
    if (user.status == UserStatus.Inactive) {
      throw new DisabledUserException(ErrorType.InactiveUser);
    }
    if (user.status == UserStatus.Blocked) {
      throw new DisabledUserException(ErrorType.BlockedUser);
    }
    return user;
  }
}
