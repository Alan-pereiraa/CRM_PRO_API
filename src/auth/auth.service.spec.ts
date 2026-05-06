import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  const prismaMock = {
    account: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    session: {
      create: jest.fn(),
    },
  };

  const jwtMock = {
    sign: jest
      .fn()
      .mockImplementation((payload: { sub: string }) => `token-${payload.sub}`),
  };

  const bcryptMock = jest.mocked(bcrypt);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: jwtMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('signUp deve criar usuário, criar sessão e retornar tokens', async () => {
    bcryptMock.hash.mockResolvedValueOnce('hashed-password' as never);

    prismaMock.account.create.mockResolvedValueOnce({
      id: 'user-1',
      name: 'Teste',
      email: 'teste@teste.com',
    });

    prismaMock.session.create.mockResolvedValueOnce({
      id: 'session-1',
    });

    const result = await service.signUp({
      name: 'Teste',
      email: 'teste@teste.com',
      password: '123456',
    } as any);

    expect(prismaMock.account.create).toHaveBeenCalled();
    expect(prismaMock.session.create).toHaveBeenCalled();
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(result.email).toBe('teste@teste.com');
  });

  it('Sign-in deve validar as credenciais, e criar a sessão do usuário', async () => {
    const account: { email: string; password: string } = {
      email: 'teste@teste.com',
      password: 'hashed-password',
    };

    prismaMock.account.findUnique.mockResolvedValueOnce(account);

    bcryptMock.compare.mockResolvedValueOnce(true);

    const result = await service.signIn({
      email: account.email,
      password: '123456',
    } as any);

    expect(prismaMock.account.findUnique).toHaveBeenCalled();
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
  });
});
