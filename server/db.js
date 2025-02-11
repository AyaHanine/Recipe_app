import { Sequelize } from "sequelize";

const sequelize = new Sequelize("recipe_app", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default sequelize;
