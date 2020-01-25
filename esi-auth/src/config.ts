const throwIfUndefined = (env: string): string => {
  if (!process.env[env]) {
    throw new Error(`Environment variable "${env}" is required.`);
  }
  return process.env[env];
};

interface EnvironmentVariables {
  esiId: string;
  esiSecret: string;
  redirectUrl: string;
  jwtExpire: string | number;
  jwtSecret: string;
}

const variables: EnvironmentVariables = {
  esiId: throwIfUndefined('ESI_CLIENT'),
  esiSecret: throwIfUndefined('ESI_SECRET'),
  redirectUrl: `${throwIfUndefined('REDIRECT_URL')}/oauth/callback`,
  jwtExpire: throwIfUndefined('JWT_EXPIRE'),
  jwtSecret: throwIfUndefined('JWT_SECRET'),
};

export default variables;
