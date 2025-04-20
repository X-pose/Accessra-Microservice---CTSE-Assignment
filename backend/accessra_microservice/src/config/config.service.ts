import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    // Initialize with process.env
    this.envConfig = { ...process.env };
    
    // Try to load from .env file if it exists
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envFileConfig = dotenv.parse(fs.readFileSync(envPath));
      // Merge with priority to .env file values
      this.envConfig = { ...this.envConfig, ...envFileConfig };
    }
    
    // Log non-sensitive environment variables
    console.log('ConfigService initialized');
    console.log('PROD_DB_HOST:', this.envConfig.PROD_DB_HOST);
    console.log('PROD_DB_PORT:', this.envConfig.PROD_DB_PORT);
    // Don't log sensitive information like usernames
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  get databaseConfig() {
    return {
      host: this.get('PROD_DB_HOST') || 'localhost',
      port: parseInt(this.get('PROD_DB_PORT') || '5432', 10),
      username: this.get('PROD_DB_USERNAME') || 'postgres',
      password: this.get('PROD_DB_PASSWORD') || 'postgres',
      database: this.get('PROD_DB_NAME') || 'multi_tenant',
      jwt_secret: this.get('JWT_SECRET') || 'secret'
    };
  }
}