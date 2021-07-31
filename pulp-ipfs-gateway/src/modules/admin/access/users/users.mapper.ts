import { PermissionEntity } from '../permissions/permission.entity';
import { PermissionMapper } from '../permissions/permission.mapper';
import { RoleEntity } from '../roles/role.entity';
import { RoleMapper } from '../roles/role.mapper';
import {
  CreateUserRequestDto, UpdateUserRequestDto, UserResponseDto
} from './dtos';
import { UserStatus } from './user-status.enum';
import { UserEntity } from './user.entity';

export class UserMapper {
  public static async toDto(entity: UserEntity): Promise<UserResponseDto> {
    const dto = new UserResponseDto();

    dto.id = entity.id;
    dto.address = entity.address;
    dto.nonce = entity.nonce;
    dto.status = entity.status;
    dto.isSuperUser = entity.isSuperUser;
    return dto;
  }

  public static async toDtoWithRelations(entity: UserEntity): Promise<UserResponseDto> {
    const dto = new UserResponseDto();

    dto.id = entity.id;
    dto.address = entity.address;
    dto.nonce = entity.nonce;
    dto.permissions = await Promise.all((await entity.permissions).map(PermissionMapper.toDto));
    dto.roles = await Promise.all((await entity.roles).map(RoleMapper.toDtoWithRelations));
    dto.isSuperUser = entity.isSuperUser;
    dto.status = entity.status;
    return dto;
  }

  public static toCreateEntity(dto: CreateUserRequestDto): UserEntity {
    const entity = new UserEntity();
    entity.address = dto.address;
    entity.nonce = dto.nonce;
    entity.permissions = Promise.resolve(dto.permissions.map(id => new PermissionEntity({ id })));
    entity.roles = Promise.resolve(dto.roles.map(id => new RoleEntity({ id })));
    entity.status = UserStatus.Active;
    entity.isSuperUser = false;
    return entity;
  }

  public static toUpdateEntity(
    entity: UserEntity,
    dto: UpdateUserRequestDto
  ): UserEntity {
    entity.address = dto.address;
    entity.nonce = dto.nonce;
    entity.permissions = Promise.resolve(dto.permissions.map(id => new PermissionEntity({ id })));
    entity.roles = Promise.resolve(dto.roles.map(id => new RoleEntity({ id })));
    entity.status = dto.status;
    return entity;
  }
}
