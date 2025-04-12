import * as process from 'node:process';
import { Algorithm } from 'jsonwebtoken';

export type DatabaseConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
};

export type JWTConfig = {
  algorithm: Algorithm;
  expires: string;
  audience: string;
  issuer: string;
  secret: string;
};

type EnvMode = 'production' | 'release' | 'staging' | 'development';

export type AppConfig = {
  env: EnvMode;
  port: number;
};

type Config = {
  database: DatabaseConfig;
  jwt: JWTConfig;
  app: AppConfig;
};

export default (): Config => {
  const nodeEnv = (process.env.NODE_ENV ?? 'development') as EnvMode;
  return {
    app: {
      env: nodeEnv,
      port: parseInt(process.env.PORT ?? '3000'),
    },
    jwt: {
      algorithm: (process.env.JWT_ALGORITHM ?? 'HS256') as Algorithm,
      expires: process.env.JWR_EXPIRES ?? '1h',
      audience: process.env.JWT_AUDIENCE ?? 'kanban-be',
      issuer: process.env.JWT_ISSUER ?? 'kanban-be',
      secret: process.env.JWT_SECRET ?? 'kanban-be',
    },

    database: {
      host: process.env.DATABASE_HOST ?? 'localhost',
      port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
      username: process.env.DATABASE_USERNAME ?? 'kanban-be',
      password: process.env.DATABASE_PASSWORD ?? 'kanban-be',
      database: process.env.DATABASE_DATABASE ?? 'kanban-be',
      synchronize: !['production', 'release'].includes(nodeEnv),
    },
  };
};
