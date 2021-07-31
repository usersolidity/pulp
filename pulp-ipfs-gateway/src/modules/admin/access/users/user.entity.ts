import { BaseEntity } from '@database/entities';
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { PermissionEntity } from '../permissions/permission.entity';
import { RoleEntity } from '../roles/role.entity';
import { UserStatus } from './user-status.enum';

@Entity({ schema: 'admin', name: 'users' })
export class UserEntity extends BaseEntity {
  @PrimaryColumn({ name: 'id', type: 'uuid', generated: 'uuid' })
  id?: string;

  @Column({
    name: 'address',
    type: 'varchar',
    unique: true,
  })
  address: string;

  @Column({
    name: 'nonce',
    type: 'varchar',
    nullable: false,
  })
  nonce: string;

  @Column({
    name: 'is_super_user',
    type: 'boolean',
    nullable: false,
    default: false
  })
  isSuperUser: boolean;

  @Column({
    name: 'status',
    type: 'enum',
    enum: UserStatus,
    nullable: false,
  })
  status: UserStatus;

  @ManyToMany(
    () => RoleEntity,
    role => role.id,
    { lazy: true, cascade: true },
  )
  @JoinTable({
    name: 'users_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id'
    }
  })
  roles: Promise<RoleEntity[]>;

  @ManyToMany(
    () => PermissionEntity,
    permission => permission.id,
    { lazy: true, cascade: true },
  )
  @JoinTable({
    name: 'users_permissions',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id'
    }
  })
  permissions: Promise<PermissionEntity[]>;

  constructor(user?: Partial<UserEntity>) {
    super();
    Object.assign(this, user);
  }

}
