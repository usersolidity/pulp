import {
    JwtAuthGuard, Permissions, PermissionsGuard, TOKEN_NAME
} from '@auth';
import {
    ApiGlobalResponse,
    ApiPaginatedResponse,
    PaginationParams
} from '@common/decorators';
import { PaginationResponseDto } from '@common/dtos';
import { PaginationRequest } from '@common/interfaces';
import {
    Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, UseGuards, ValidationPipe
} from '@nestjs/common';
import {
    ApiBearerAuth, ApiConflictResponse, ApiOperation,
    ApiQuery,
    ApiTags
} from '@nestjs/swagger';
import {
    CreateUserRequestDto,
    UpdateUserRequestDto,
    UserResponseDto
} from './dtos';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth(TOKEN_NAME)
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('access/users')
export class UsersController {

    constructor(private usersService: UsersService) { }

    @ApiOperation({ description: 'Get a paginated user list' })
    @ApiPaginatedResponse(UserResponseDto)
    @ApiQuery({ name: 'search', type: 'string', required: false, example: 'admin' })
    @Permissions(
        'admin.access.users.read',
        'admin.access.users.create',
        'admin.access.users.update'
    )
    @Get()
    public getUsers(
        @PaginationParams() pagination: PaginationRequest,
    ): Promise<PaginationResponseDto<UserResponseDto>> {
        return this.usersService.getUsers(pagination);
    }

    @ApiOperation({ description: 'Get user by id' })
    @ApiGlobalResponse(UserResponseDto)
    @Permissions(
        'admin.access.users.read',
        'admin.access.users.create',
        'admin.access.users.update'
    )
    @Get('/:id')
    public getUserById(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
        return this.usersService.getUserById(id);
    }

    @ApiOperation({ description: 'Create new user' })
    @ApiGlobalResponse(UserResponseDto)
    @ApiConflictResponse({ description: 'User already exists' })
    @ApiGlobalResponse(UserResponseDto)
    @Permissions('admin.access.users.create')
    @Post()
    public createUser(
        @Body(ValidationPipe) UserDto: CreateUserRequestDto,
    ): Promise<UserResponseDto> {
        return this.usersService.createUser(UserDto);
    }

    @ApiOperation({ description: 'Update user by id' })
    @ApiGlobalResponse(UserResponseDto)
    @ApiConflictResponse({ description: 'User already exists' })
    @Permissions('admin.access.users.update')
    @Put('/:id')
    public updateUser(
        @Param('id', ParseUUIDPipe) id: string,
        @Body(ValidationPipe) UserDto: UpdateUserRequestDto,
    ): Promise<UserResponseDto> {
        return this.usersService.updateUser(id, UserDto)
    };

    // @ApiOperation({ description: 'Change user password' })
    // @ApiGlobalResponse(UserResponseDto)
    // @Post('/change/password')
    // changePassword(
    //     @Body(ValidationPipe) changePassword: ChangePasswordRequestDto,
    //     @CurrentUser() user: UserEntity,
    // ): Promise<UserResponseDto> {
    //     return this.usersService.changePassword(changePassword, user.id);
    // }
}
