import express from "express";
import { RouteNotFound } from "./404.controller";

const router = express.Router();

router.use(RouteNotFound.notFound);

export const RouteNotFoundRouter = router;