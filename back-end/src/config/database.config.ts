import { registerAs } from "@nestjs/config";

export default registerAs("database", () => ({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT || 27017,
  name: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  mongo: {
    connectionString: process.env.DATABASE_CONNECTION,
  },
}));
