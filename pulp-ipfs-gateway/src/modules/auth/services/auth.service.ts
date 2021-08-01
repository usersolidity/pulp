
import { UserStatus } from '@admin/access/users/user-status.enum';
import { UserEntity } from '@admin/access/users/user.entity';
import { UserMapper } from '@admin/access/users/users.mapper';
import { ErrorType } from '@common/enums';
import {
    DisabledUserException, InvalidCredentialsException
} from '@common/exeptions';
import { UsersRepository } from '@modules/admin/access/users/users.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ethers } from 'ethers';
import {
    AuthCredentialsRequestDto, JwtPayload, LoginResponseDto
} from '../dtos';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UsersRepository)
        private usersRepository: UsersRepository,
        private tokenService: TokenService,
    ) { }

    public async nonce(address: string) {
        const user = await this.usersRepository.findUserByAddress(address);
        return user.nonce;
    }

    /**
     * User authentication
     * @param authCredentialsDto {AuthCredentialsRequestDto}
     * @returns {Promise<LoginResponseDto>}
     */
    public async login({ address, signature }: AuthCredentialsRequestDto): Promise<LoginResponseDto> {
        const user: UserEntity = await this.usersRepository.findUserByAddress(address);

        if (!user) {
            throw new InvalidCredentialsException();
        }

        const message = `pulp ipfs storage nonce: ${user.nonce}`;
        let messageBytes = ethers.utils.toUtf8Bytes(message);
        let messageDigest = ethers.utils.keccak256(messageBytes);

        const recovered_address = ethers.utils.recoverAddress(messageDigest, signature);

        if (recovered_address !== address) {
            throw new InvalidCredentialsException();
        }
        if (user.status == UserStatus.Blocked) {
            throw new DisabledUserException(ErrorType.BlockedUser);
        }
        if (user.status == UserStatus.Inactive) {
            throw new DisabledUserException(ErrorType.InactiveUser);
        }

        const payload: JwtPayload = { id: user.id, address: user.address };
        const token = await this.tokenService.generateAuthToken(payload);

        const userDto = await UserMapper.toDto(user);
        const { permissions, roles } = await UserMapper.toDtoWithRelations(user);
        const additionalPermissions = permissions.map(({ slug }) => slug);
        const mappedRoles = roles.map(({ name, permissions }) => {
            const rolePermissions = permissions.map(({ slug }) => slug);
            return {
                name,
                permissions: rolePermissions
            }
        });

        return {
            user: userDto,
            token,
            access: {
                additionalPermissions,
                roles: mappedRoles
            },
        };
    }
}
