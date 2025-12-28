import express from "express";
import { PostRouter } from "./modules/post/post.router";
import { RouteNotFoundRouter } from "./modules/404/404.routes";
const app = express();

app.use(express.json());

//root route
app.get("/", (req, res) => {
    res.send("Welcome to Simple Blog API");
})

app.use("/api/v1", PostRouter);



//404 route
app.use(RouteNotFoundRouter);
export default app;