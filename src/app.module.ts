import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { EventsModule } from './models/events/events.module';
import { ExtractJwt } from 'passport-jwt';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { DatabaseModule } from './db/database.module';
import { SpotsModule } from './models/spots/spots.module';

@Module({
  imports: [
    DatabaseModule,
    EventsModule,
    ConfigModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: throttlerOptions,
    }),
    SpotsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

function throttlerOptions(config: ConfigService): ThrottlerModuleOptions {
  return config.app.isProd
    ? [
        {
          ttl: 10000, // 10 seconds
          limit: 30,
          getTracker: (req) => {
            try {
              const token = ExtractJwt.fromAuthHeaderAsBearerToken()(
                req as express.Request,
              );
              if (token) {
                const payload = jwt.decode(token) as jwt.JwtPayload;
                if (payload?.sub) {
                  return payload.sub;
                }
              }
            } catch (e) {
              // ignore
            }
            return req.ip;
          },
        },
      ]
    : [];
}
