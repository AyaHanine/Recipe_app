import Recipe from "../models/Recipes.js";
import express from "express";
import User from "../models/Users.js";
import { verifyToken } from "./users.js";

const router = express.Router();

// GET toutes les recettes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.findAll();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({
      error: "Erreur lors de la récupération des recettes",
      details: err,
    });
  }
});

router.post("/", verifyToken, async (req, res) => {
  const { userOwner, ...recipeData } = req.body;

  console.log("User Owner ID:", userOwner);
  console.log("Recipe Data:", recipeData);

  try {
    const user = await User.findByPk(userOwner); // Trouve l'utilisateur par son ID

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const recipe = await Recipe.create({
      ...recipeData,
      userOwner: user.id,
      user: user.username, // Ajout du username de l'utilisateur
    });

    res.status(201).json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Erreur lors de la création de la recette",
      details: err.message || err,
    });
  }
});

// PUT : Ajouter une recette aux recettes enregistrées de l'utilisateur
router.put("/", verifyToken, async (req, res) => {
  const { recipeId, userID } = req.body;

  try {
    const user = await User.findByPk(userID);

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const recipe = await Recipe.findByPk(recipeId);

    if (!recipe) {
      return res.status(404).json({ error: "Recette non trouvée" });
    }

    const savedRecipes = user.savedRecipes ? JSON.parse(user.savedRecipes) : [];
    savedRecipes.push(recipeId);

    user.savedRecipes = JSON.stringify(savedRecipes);
    await user.save();

    res.json({ savedRecipes });
  } catch (err) {
    res.status(500).json({
      error: "Erreur lors de la mise à jour des recettes sauvegardées",
      details: err,
    });
  }
});

// GET : IDs des recettes sauvegardées d'un utilisateur
router.get("/savedRecipes/ids/:userID", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userID);

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const savedRecipes = user.savedRecipes ? JSON.parse(user.savedRecipes) : [];
    res.json({ savedRecipes });
  } catch (err) {
    res.status(500).json({
      error: "Erreur lors de la récupération des recettes sauvegardées",
      details: err,
    });
  }
});

// GET : Détails des recettes sauvegardées d'un utilisateur
router.get("/savedRecipes/:userID", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userID);

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const savedRecipesIds = user.savedRecipes
      ? JSON.parse(user.savedRecipes)
      : [];
    const savedRecipes = await Recipe.findAll({
      where: { id: savedRecipesIds },
    });

    res.json({ savedRecipes });
  } catch (err) {
    res.status(500).json({
      error:
        "Erreur lors de la récupération des détails des recettes sauvegardées",
      details: err,
    });
  }
});

export { router as RecipeRouter };
