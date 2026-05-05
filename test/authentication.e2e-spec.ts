import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { execSync } from 'node:child_process';

describe('Authentication (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    execSync('npx prisma migrate deploy', {
      stdio: 'inherit',
      env: process.env,
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
  });

  it('auth/sign-up (POST) -> Deve criar a conta de um usuário e retornar 201', async () => {
    await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({
        name: 'Admin Teste',
        email: 'admin@teste.com',
        password: 'admin123',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('refreshToken');
        expect(res.body).toHaveProperty('id');
        expect(res.body.email).toEqual('admin@teste.com');
        expect(res.body.name).toEqual('Admin Teste');

        expect(res.body).not.toHaveProperty('password');
        expect(res.body).not.toHaveProperty('password_hash');
      });
  });

  it('auth/sign-in (POST) -> Deve autenticar um usuário e retornar 200', async () => {
    await prisma.account.create({
      data: {
        name: 'Admin Teste',
        email: 'admin@teste.com',
        password_hash: 'admin123',
      },
    });

    await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        email: 'admin@teste.com',
        password: 'admin123',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toEqual('admin@teste.com');
        expect(res.body.name).toEqual('Admin Teste');
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('refreshToken');

        expect(res.body).not.toHaveProperty('password');
        expect(res.body).not.toHaveProperty('password_hash');
      });
  });

  it('auth/sign-out (POST) -> Deve desconectar um usuário e retornar 200', async () => {
    const user = await request(app.getHttpServer()).post('/auth/sign-up').send({
      name: 'Admin Teste',
      email: 'admin@teste.com',
      password: 'admin123',
    });

    const refreshToken = user.body.refreshToken;

    await request(app.getHttpServer())
      .post('/auth/sign-out')
      .send({ refreshToken })
      .expect(200);

    const sessions = await prisma.session.findMany();

    expect(sessions.length).toBe(0);
  });

  it('auth/profile (GET) -> Deve retornar o perfil do usuário e retornar 200', async () => {
    const user = await request(app.getHttpServer()).post('/auth/sign-up').send({
      name: 'Admin Teste',
      email: 'admin@teste.com',
      password: 'admin123',
    });

    const accessToken = user.body.accessToken;

    await request(app.getHttpServer())
      .get('/auth/profile/')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name');
        expect(res.body).toHaveProperty('email');

        expect(res.body).not.toHaveProperty('password');
        expect(res.body).not.toHaveProperty('password_hash');
      });
  });

  it('auth/refresh (GET) -> Deve atualizar o token do usuário e retornar 200', async () => {
    const user = await request(app.getHttpServer()).post('/auth/sign-up').send({
      name: 'Admin Teste',
      email: 'admin@teste.com',
      password: 'admin123',
    });

    const refreshToken = user.body.refreshToken;

    await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('accessToken');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
