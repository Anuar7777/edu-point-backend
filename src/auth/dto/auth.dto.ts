import { ApiProperty } from '@nestjs/swagger'
import { Role } from '@prisma/client'
import { IsEmail, IsEnum, IsString, Length, MinLength } from 'class-validator'

export class AuthDto {
	@ApiProperty({
		example: 'aigul@smartbala.com',
		description: 'User email address',
	})
	@IsEmail()
	email: string

	@ApiProperty({
		example: 'password123',
		description: 'User password (min 6 characters)',
		minLength: 6,
	})
	@IsString()
	@MinLength(6, { message: 'Password must be at least 6 characters long' })
	password: string
}

export class RegisterDto extends AuthDto {
	@ApiProperty({
		example: 'Nursultan',
		description: 'Username of the new user',
	})
	@IsString()
	username: string

	@ApiProperty({
		example: 'PARENT',
		enum: Role,
		description: 'Role of the user (PARENT or CHILD)',
	})
	@IsEnum(Role, { message: 'Role must be either PARENT or CHILD' })
	role: Role
}

export class VerifyCodeDto {
	@ApiProperty({
		example: 'aidar@smartbala.com',
		description: 'Email used for verification',
	})
	@IsEmail()
	email: string

	@ApiProperty({
		example: '123456',
		description: 'Verification code sent to email',
	})
	@IsString()
	@Length(4, 10, { message: 'Code must be between 4 and 10 characters long' })
	code: string
}
