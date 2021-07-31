import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthCredentialsRequestDto {

  @IsNotEmpty()
  @ApiProperty({
    example: '0x5d20caFc82feDE339aCFF0d3097b07B3E3E940b5',
  })
  readonly address: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'signed nonce',
  })
  readonly signature: string;
}
