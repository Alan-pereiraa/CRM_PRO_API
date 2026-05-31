import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { FunnelService } from '../funnel/funnel.service';
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
      update: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const jwtMock = {
    sign: jest
      .fn()
      .mockImplementation((payload: { sub: string }) => `token-${payload.sub}`),
    verify: jest.fn(),
  };

  const funnelServiceMock = {
    createDefaultsForAccount: jest.fn().mockResolvedValue(undefined),
  };

  const hashMock = bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>;
  const compareMock = bcrypt.compare as jest.MockedFunction<
    typeof bcrypt.compare
  >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: jwtMock },
        { provide: FunnelService, useValue: funnelServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('signUp deve criar usuário, criar sessão e retornar tokens', async () => {
    hashMock
      .mockImplementationOnce(async () => 'hashed-password')
      .mockImplementationOnce(async () => 'hashed-refresh-token');

    prismaMock.account.create.mockResolvedValueOnce({
      id: 'user-1',
      name: 'Teste',
      email: 'teste@teste.com',
    });

    prismaMock.session.create.mockResolvedValueOnce({
      id: 'session-1',
    });

    prismaMock.session.update.mockResolvedValueOnce({
      id: 'session-1',
      token_hash: 'hashed-refresh-token',
    });

    const result = await service.signUp({
      name: 'Teste',
      email: 'teste@teste.com',
      password: '123456',
    } as any);

    expect(prismaMock.account.create).toHaveBeenCalled();
    expect(prismaMock.session.create).toHaveBeenCalled();
    expect(prismaMock.session.update).toHaveBeenCalled();
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(result.account.email).toBe('teste@teste.com');
  });

  it('Sign-in deve validar as credenciais, e criar a sessão do usuário', async () => {
    const account = {
      id: 'user-1',
      name: 'Teste',
      email: 'teste@teste.com',
      password_hash: 'hashed-password',
    };

    prismaMock.account.findUnique.mockResolvedValueOnce(account);
    prismaMock.session.create.mockResolvedValueOnce({ id: 'session-1' });
    prismaMock.session.update.mockResolvedValueOnce({
      id: 'session-1',
      token_hash: 'hashed-refresh-token',
    });
    hashMock.mockImplementationOnce(async () => 'hashed-refresh-token');

    compareMock.mockImplementationOnce(async () => true);

    const result = await service.signIn({
      email: account.email,
      password: '123456',
    } as any);

    expect(prismaMock.account.findUnique).toHaveBeenCalled();
    expect(prismaMock.session.create).toHaveBeenCalled();
    expect(prismaMock.session.update).toHaveBeenCalled();
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
  });

  it('refreshToken deve validar o hash persistido antes de renovar os tokens', async () => {
    jwtMock.verify.mockReturnValueOnce({ sub: 'user-1', jti: 'session-1' });
    prismaMock.session.findUnique.mockResolvedValueOnce({
      id: 'session-1',
      token_hash: 'stored-hash',
    });
    compareMock.mockImplementationOnce(async () => true);
    hashMock.mockImplementationOnce(async () => 'rotated-hash');
    prismaMock.session.update.mockResolvedValueOnce({
      id: 'session-1',
      token_hash: 'rotated-hash',
    });

    const result = await service.refreshToken('old-refresh-token');

    expect(jwtMock.verify).toHaveBeenCalledWith('old-refresh-token');
    expect(compareMock).toHaveBeenCalledWith(
      'old-refresh-token',
      'stored-hash',
    );
    expect(prismaMock.session.update).toHaveBeenCalled();
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
  });
});
