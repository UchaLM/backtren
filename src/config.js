import "dotenv/config";

export const config = {
  port: process.env.PORT || 3000,

  dbHost: process.env.DB_HOST || process.env.host,
  dbPort: process.env.DB_PORT || process.env.port,
  dbName: process.env.DB_NAME || process.env.database,
  dbUser: process.env.DB_USER || process.env.user,
  dbPassword: process.env.DB_PASSWORD || process.env.password,

  jwtSecret: process.env.JWT_SECRET,
};
