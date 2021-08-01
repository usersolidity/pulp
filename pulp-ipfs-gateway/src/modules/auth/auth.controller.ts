import {
    Body, Controller, Get, Param, Post, ValidationPipe
} from '@nestjs/common';
import {
    ApiInternalServerErrorResponse, ApiOkResponse,
    ApiOperation,
    ApiTags, ApiUnauthorizedResponse
} from '@nestjs/swagger';
import {
    AuthCredentialsRequestDto, LoginResponseDto, RefreshTokenRequestDto, TokenDto, ValidateTokenRequestDto, ValidateTokenResponseDto
} from './dtos';
import {
    AuthService, TokenService
} from './services';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private tokenService: TokenService
    ) { }

    @ApiOperation({ description: 'Get address nonce' })
    @ApiOkResponse({ description: 'Successfully returned nonce' })
    @ApiInternalServerErrorResponse({ description: 'Server error' })
    @Get('/:address/nonce')
    async nonce(@Param('address') address: string): Promise<{ nonce: string; address: string; }> {
        const nonce = await this.authService.nonce(address);
        return { nonce, address };
    }

    @ApiOperation({ description: 'User authentication' })
    @ApiOkResponse({ description: 'Successfully authenticated user' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    @ApiInternalServerErrorResponse({ description: 'Server error' })
    @Post('/login')
    login(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsRequestDto): Promise<LoginResponseDto> {
        return this.authService.login(authCredentialsDto);
    }

    @ApiOperation({ description: 'Renew access in the application' })
    @ApiOkResponse({ description: 'token successfully renewed' })
    @ApiUnauthorizedResponse({ description: 'Refresh token invalid or expired' })
    @ApiInternalServerErrorResponse({ description: 'Server error' })
    @Post('/token/refresh')
    async getNewToken(
        @Body(ValidationPipe) refreshTokenDto: RefreshTokenRequestDto
    ): Promise<TokenDto> {
        const { refreshToken } = refreshTokenDto;
        return this.tokenService.generateRefreshToken(refreshToken);
    }

    @ApiOperation({ description: 'Validate token' })
    @ApiOkResponse({ description: 'Validation was successful' })
    @ApiInternalServerErrorResponse({ description: 'Server error' })
    @Post('/token/validate')
    async validateToken(
        @Body(ValidationPipe) validateToken: ValidateTokenRequestDto
    ): Promise<ValidateTokenResponseDto> {
        const { token } = validateToken
        return this.tokenService.validateToken(token);
    }
}
