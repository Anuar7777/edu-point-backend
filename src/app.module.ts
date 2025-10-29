import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { CodeModule } from './code/code.module'
import { FamilyModule } from './family/family.module'
import { UserModule } from './user/user.module'
import { CourseModule } from './course/course.module';
import { SettingsModule } from './settings/settings.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: process.env.NODE_ENV === 'test' ? '.env.test.local' : '.env',
		}),
		AuthModule,
		UserModule,
		FamilyModule,
		CodeModule,
		CourseModule,
		SettingsModule,
	],
})
export class AppModule {}
