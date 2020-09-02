const isProd = (process.env.PROD = 'true');
export const AppEnvironment = {
  dbHost: isProd
    ? 'mongodb://mongo/member_db'
    : 'mongodb://mongo/member_db',
};
