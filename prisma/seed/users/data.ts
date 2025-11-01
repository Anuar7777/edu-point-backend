import { Role } from '@prisma/client'

export const usersData = [
	{
		userId: '0e23c5ed-9d55-4509-9ac2-27e5a18026fb',
		username: 'Айгүл',
		email: 'aigul@smartbala.com',
		password: 'password123',
		role: Role.PARENT,
	},
	{
		userId: 'd12bec0e-423e-400b-8ba4-9e81c1b382b4',
		username: 'Ернар',
		email: 'ernar@smartbala.com',
		password: 'password123',
		role: Role.CHILD,
	},
	{
		userId: 'bbca1f7b-825a-44cd-9e0a-2f96975e7ae5',
		username: 'Дана',
		email: 'dana@smartbala.com',
		password: 'password123',
		role: Role.CHILD,
	},
	{
		userId: '26362ffd-4d6c-4ec2-a48b-3703a130d668',
		username: 'Арсен',
		email: 'arsen@smartbala.com',
		password: 'password123',
		role: Role.CHILD,
	},
	{
		userId: '38753859-146e-4630-b1b8-b8c093590deb',
		username: 'Мадина',
		email: 'madina@smartbala.com',
		password: 'password123',
		role: Role.CHILD,
	},
]
