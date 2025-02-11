import sequelize from "./db.js";

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connexion à la base MySQL réussie !");
  } catch (error) {
    console.error("Erreur de connexion :", error);
  }
})();
