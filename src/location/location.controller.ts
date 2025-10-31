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

@ApiTags('Location')
@ApiBearerAuth()
@Controller('location')
export class LocationController {
	constructor(private readonly locationService: LocationService) {}

	@Auth()
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

	@Auth()
	@Get('family')
	@ApiOperation({
		summary: "Get locations of all members in the user's family",
	})
	@ApiResponse({
		status: 200,
		description: 'Successfully retrieved family locations',
	})
	async getFamilyLocations(@CurrentUser() user: UserTokenDto) {
		return this.locationService.getFamilyLocationsByUser(user.id)
	}
}
