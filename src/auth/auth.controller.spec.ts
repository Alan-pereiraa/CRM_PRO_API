import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthController', () => {
  let controller: AuthController;

  const authServiceMock = {
    signUp: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        {
          provide: JwtAuthGuard,
          useValue: { canActivate: jest.fn(() => true) },
        },
        { provide: JwtService, useValue: { verify: jest.fn() } },
        {
          provide: PrismaService,
          useValue: {
            session: { findUnique: jest.fn() },
            account: { findUnique: jest.fn() },
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  it('Deve criar uma conta de usuário e retornar os tokens de acesso e atualização', async () => {
    const payload = {
      name: 'Teste',
      email: 'teste@teste.com',
      password: 'teste123',
    };

    authServiceMock.signUp.mockResolvedValueOnce({
      id: 'user-1',
      email: payload.email,
      name: payload.name,
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    const result = await controller.signUp(payload);

    expect(authServiceMock.signUp).toHaveBeenCalledWith(payload);
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(result).toHaveProperty('id');
    expect(result.email).toEqual('teste@teste.com');
  });
});
