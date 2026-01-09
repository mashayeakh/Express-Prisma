import express from "express";
import cors from "cors";
import { PostRouter } from "./modules/post/post.router";
// import { RouteNotFoundRouter } from "./modules/404/404.routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { CommentController } from "./modules/comment/comment.controller";
import { CommentRouter } from "./modules/comment/comment.router";
import { errorHandler } from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";

const app = express();

app.use(express.json());

//cors
app.use(cors({
    //set origin
    origin: process.env.APP_URL || "http://localhost:4000",// client side url
    credentials: true,
}))


app.all('/api/auth/*splat', toNodeHandler(auth));

//root route
app.get("/", (req, res) => {
    res.send("Welcome to Simple Blog API");
})



app.use("/api/v1/post", PostRouter);
app.use("/api/v1/comment", CommentRouter);


//global err handler
app.use(errorHandler)

//404 route
app.use(notFound);
export default app;