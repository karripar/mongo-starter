import express from "express";

import {
  postSpecies,
  getSpecies,
  getSpeciesById,
  modifySpecies,
  deleteSpecies,
  findSpeciesByArea
} from "../controllers/speciesController";


const router = express.Router();

router.route("/").post(postSpecies).get(getSpecies);

router.route("/:id").get(getSpeciesById).put(modifySpecies).delete(deleteSpecies);

router.route("/area").post(findSpeciesByArea)

export default router;
