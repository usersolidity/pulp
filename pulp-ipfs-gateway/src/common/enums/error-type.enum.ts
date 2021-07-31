export enum ErrorType {
    InvalidToken = 'INVALID_TOKEN',
    AccessTokenExpired = 'ACCESS_TOKEN_EXPIRED',
    RefreshTokenExpired = 'REFRESH_TOKEN_EXPIRED',
    PermissionExists = 'PERMISSION_EXISTS',
    RoleExists = 'ROLE_EXISTS',
    UserExists = 'USER_EXISTS',
    InvalidSignature = 'INVALID_SIGNATURE',
    InvalidCredentials = 'INVALID_CREDENTIALS',
    BlockedUser = 'BLOCKED_USER',
    InactiveUser = 'INACTIVE_USER',
    ForeignKeyConflict = 'FOREIGN_KEY_CONFLICT'
}
