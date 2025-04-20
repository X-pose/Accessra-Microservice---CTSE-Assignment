import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AccessRA Microservice (e2e)', () => {
  let app: INestApplication;

  // Use beforeAll instead of beforeEach for better performance when running multiple tests
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Configure the app with the same settings as in main.ts
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
    }));
    await app.init();
  });

  // Clean up after all tests
  afterAll(async () => {
    await app.close();
  });

  describe('Root endpoint', () => {
    it('/ (GET) should return welcome message', () => {
      return request(app.getHttpServer())
        .get('/auth/')
        .expect(200)
        .expect('Hello World!');
    });
  });

  describe('Authentication endpoints', () => {
    it('/auth/login (POST) should reject invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({ email: 'nonexistent@gmail.com', password: 'wrongpassword' })
        .expect(401);
    });

    it('/auth/register (POST) should validate input', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'test' }) // Missing required fields
        .expect(400);
    });
  });

  describe('User endpoints', () => {
    it('/users (GET) should require authentication', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(401);
    });
  });
});