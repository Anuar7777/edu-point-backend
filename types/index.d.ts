export type JwtPayload = {
	id: string
}

export type RequestWithUser = Request & {
	user: JwtPayload
}
