import { ApiProperty } from '@nestjs/swagger';
import {
    ArrayNotEmpty,
    IsAlphanumeric,
    IsArray,
    IsInt,
    IsNotEmpty,
    Length,
    Matches
} from 'class-validator';

const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
export class CreateUserRequestDto {

    @IsNotEmpty()
    @IsAlphanumeric()
    @ApiProperty({
        example: '0x5d20caFc82feDE339aCFF0d3097b07B3E3E940b5',
    })
    address: string;

    @Matches(passwordRegex, { message: 'Nonce too weak' })
    @IsNotEmpty()
    @IsAlphanumeric()
    @Length(6, 20)
    @ApiProperty({
        example: 'Hello123',
    })
    nonce: string;

    @ApiProperty({ example: [1, 2] })
    @ArrayNotEmpty()
    @IsArray()
    @IsInt({ each: true })
    permissions: number[];

    @ApiProperty({ example: [1, 2] })
    @ArrayNotEmpty()
    @IsArray()
    @IsInt({ each: true })
    roles: number[];

}
