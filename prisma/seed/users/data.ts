import { Role } from '@prisma/client'

export const usersData = [
	{
		userId: '0e23c5ed-9d55-4509-9ac2-27e5a18026fb',
		username: 'Parent User',
		email: 'parent@smartbala.com',
		password: 'password123',
		role: Role.PARENT,
	},
	{
		userId: 'd12bec0e-423e-400b-8ba4-9e81c1b382b4',
		username: 'Child User',
		email: 'child@smartbala.com',
		password: 'password123',
		role: Role.CHILD,
	},
]
