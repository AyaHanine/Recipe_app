import { DataTypes } from "sequelize";
import sequelize from "../../db.js"; // Configuration Sequelize
import User from "./Users.js"; // Assure-toi que ce modèle existe et est bien importé

const Recipe = sequelize.define("Recipe", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ingredients: {
    type: DataTypes.TEXT, // Changer le type à TEXT ou JSON
    allowNull: false,
    get() {
      const value = this.getDataValue("ingredients");
      return JSON.parse(value); // Reconstruire le tableau à partir du JSON
    },
    set(value) {
      this.setDataValue("ingredients", JSON.stringify(value)); // Stocker comme chaîne JSON
    },
  },
  instructions: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cookingTime: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userOwner: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
});

export default Recipe;
