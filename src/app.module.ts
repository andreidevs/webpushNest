import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PushModule } from './push/push.module';
import { getMongoConfig } from './configs/mongo.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { path } from 'app-root-path'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: `${path}/src/client`,
    }),
    ConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig
    }),
    PushModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
