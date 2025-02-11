import express from "express";
import cors from "cors";
import sequelize from "../db.js"; // Import de la configuration Sequelize

import { userRouter } from "./routes/users.js";
import { RecipeRouter } from "./routes/Recipes.js";

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", userRouter);
app.use("/recipes", RecipeRouter);

// Connexion à la base de données et démarrage du serveur
(async () => {
  try {
    // Connexion à la base de données
    await sequelize.authenticate();
    console.log("Connexion réussie à la base de données MySQL `recipe-app` !");

    // Synchronisation des modèles (optionnel)
    await sequelize.sync({ alter: true }); // Utilise `alter` pour ajuster les tables sans perte de données
    console.log("Les tables sont synchronisées avec succès.");

    // Démarrage du serveur
    app.listen(3001, () =>
      console.log("SERVER STARTED on http://localhost:3001")
    );
  } catch (error) {
    console.error("Erreur lors de la connexion à la base de données :", error);
    process.exit(1);
  }
})();
