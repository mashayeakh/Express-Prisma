import express from "express";
import cors from "cors";
import { PostRouter } from "./modules/post/post.router";
import { RouteNotFoundRouter } from "./modules/404/404.routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app = express();

app.use(express.json());

app.all('/api/auth/*splat', toNodeHandler(auth));

//root route
app.get("/", (req, res) => {
    res.send("Welcome to Simple Blog API");
})

app.use("/api/v1", PostRouter);



//404 route
app.use(RouteNotFoundRouter);
export default app;