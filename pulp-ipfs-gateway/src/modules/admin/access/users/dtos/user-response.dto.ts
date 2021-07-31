import { ApiProperty } from '@nestjs/swagger';
import { PermissionResponseDto } from '../../permissions/dtos';
import { RoleResponseDto } from '../../roles/dtos';
import { UserStatus } from '../user-status.enum';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  nonce: string;

  @ApiProperty({ type: [RoleResponseDto] })
  roles?: RoleResponseDto[];

  @ApiProperty({ type: [PermissionResponseDto] })
  permissions?: PermissionResponseDto[];

  @ApiProperty()
  isSuperUser: boolean;

  @ApiProperty()
  status: UserStatus;
}
