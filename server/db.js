import dotenv from 'dotenv';
import { Sequelize } from "sequelize";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'recipe_app',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || null, 
  {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT || "mysql",
  }
);

export default sequelize; 

