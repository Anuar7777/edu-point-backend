import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { CodeModule } from './code/code.module'
import { CourseModule } from './course/course.module'
import { FamilyModule } from './family/family.module'
import { LocationModule } from './location/location.module'
import { SettingsModule } from './settings/settings.module'
import { UserModule } from './user/user.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { TestModule } from './test/test.module'
import { SectionModule } from './section/section.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: process.env.NODE_ENV === 'test' ? '.env.test.local' : '.env',
		}),
		ServeStaticModule.forRoot({
			rootPath: join(process.cwd(), 'public'),
			serveRoot: '/public',
			exclude: ['/api'],
		}),
		AuthModule,
		UserModule,
		FamilyModule,
		CodeModule,
		CourseModule,
		SettingsModule,
		LocationModule,
		TestModule,
		SectionModule,
	],
})
export class AppModule {}
