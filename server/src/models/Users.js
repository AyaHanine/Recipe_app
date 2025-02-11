import { DataTypes } from "sequelize";
import sequelize from "../../db.js";

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false, // Équivalent de `required: true`
    unique: true, // Username doit être unique
  },
  savedRecipes: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false, // Équivalent de `required: true`
  },
});

export default User;
