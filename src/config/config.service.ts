import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private config: NestConfigService) {}

  get app() {
    const env = this.config.get<string>('NODE_ENV', 'local') as
      | 'local'
      | 'development'
      | 'production';

    return {
      env,
      isLocal: env === 'local',
      isDev: env === 'development',
      isProd: env === 'production',
      port: this.config.get<number>('PORT', 3000),
      url: this.config.get<string>('API_URL', 'http://localhost:3000'),
    };
  }

  get cookie() {
    return {
      domain: this.config.get<string>('COOKIE_DOMAIN', 'localhost'),
      tokenName: this.config.get<string>('COOKIE_TOKEN_NAME', 'ddat_local'),
    };
  }

  get cors() {
    return {
      origin: this.config.get<string>('CORS_ORIGIN', 'http://localhost:5000'),
    };
  }

  get database() {
    return {
      host: this.config.get<string>('DATABASE_HOST', 'localhost'),
      port: this.config.get<number>('DATABASE_PORT', 800),
      name: this.config.get<string>('DATABASE_NAME', 'db_full_cycle'),
      username: this.config.get<string>('DATABASE_USERNAME', 'root'),
      password: this.config.get<string>('DATABASE_PASSWORD', 'senha123'),
    };
  }
}
