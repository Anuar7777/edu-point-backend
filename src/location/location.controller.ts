import { Body, Controller, Get, Put } from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { UserTokenDto } from '../auth/dto/user-token.dto'
import { LocationDto } from './dto/location.dto'
import { LocationService } from './location.service'
import { IsParent } from '../auth/decorators/roles.decorator'

@ApiTags('Location')
@ApiBearerAuth()
@Auth()
@Controller('location')
export class LocationController {
	constructor(private readonly locationService: LocationService) {}

	@Get()
	@IsParent()
	@ApiOperation({ summary: 'Get the last known location of the family' })
	@ApiResponse({
		status: 200,
		description: 'Last location retrieved successfully',
	})
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	async get(@CurrentUser('id') userId: string) {
		return this.locationService.getFamilyLocationsByUser(userId)
	}

	@Put()
	@ApiOperation({ summary: 'Update last location of the current user' })
	@ApiResponse({ status: 200, description: 'Location updated successfully' })
	async update(@CurrentUser() user: UserTokenDto, @Body() dto: LocationDto) {
		return this.locationService.updateLastLocation(
			user.id,
			dto.latitude,
			dto.longitude,
		)
	}
}
