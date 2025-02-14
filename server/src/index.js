import express from "express";
import cors from "cors";
import sequelize from "../db.js"; // Import de la configuration Sequelize
import { userRouter } from "./routes/users.js";
import { RecipeRouter } from "./routes/Recipes.js";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import csrf from "csurf";
import rateLimit from "express-rate-limit";
import session from "express-session";
import connectRedis from "connect-redis";
import { createClient } from "redis";


const redisClient = createClient({
  host: "localhost",
  port: 6379,
});
redisClient.connect().catch(console.error);



//Gérer les sessions avec Redis pour invalider les connexions à distance
const RedisStore = connectRedis(session);
const redisStore = new RedisStore({
   client: redisClient,
   prefix: "prefix:",

 });




const app = express();
app.use(session({
  store: redisStore,
  secret : process.env.JWT_SECRET || '97bdc7a0c17e830d5edf439606ae3ca32a7ae5c4fa73cbda1446f676f014061c7d2d66654cffe3d3e4cf8c57f09460750428b86053a5293b98fd0bcb5cfdebf2',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, 
    httpOnly:true,
    maxAge: 1000*60*60*24, 
  }
}));

app.use(express.json());
app.use(cookieParser()); 
app.use(cors({credentials: true, origin: "http://localhost:3000"}));
app.use(helmet());

//middleware CSRF Protection
const csrfProtection = csrf({ cookie: true }); // Utilisation des cookies pour stocker le token CSRF
app.use(csrfProtection);
//Route pour récupérer le token CSRF et l'envoyer au front
app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

//Limite de requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Trop de requêtes effectuées depuis cette adresse IP, veuillez réessayer plus tard",
  headers: true,
});
app.use(limiter);

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
