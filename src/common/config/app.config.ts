import { validateEnv } from './env.validation';

const appConfig = () => {
  const env = validateEnv(process.env);

  return {
    port: env.PORT,

    database: {
      postgresUrl: env.DATABASE_URL,
    },

    redis: {
      url: env.REDIS_URL,
    },
  };
};

export type AppConfig = ReturnType<typeof appConfig>;

export default appConfig;