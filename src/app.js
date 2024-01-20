import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app = express();
app.use(cors(
    {
        origin: process.env.CORS_ORIGIN, // allow to server to accept request from different origin. 
        // Here I did * for development purpose
        // credentials: true // allow session cookie from browser to pass through

    }
)) // .use is used in case of middlewares
app.use(express.json({
    limit: '32kb'
})) // to parse the incoming request with JSON payloads
app.use(express.urlencoded({
    extended: true,
    limit: '32kb'
})) // to parse incoming requests with urlencoded payloads
app.use(express.static('public')) // to serve static files like images, css, js, pdf etc...
app.use(cookieParser()) // to parse the incoming request cookies and populate the req.cookies with an object keyed by the cookie names



// Routes

import userRouter from './routes/user.routes.js'
// import userRouter from './routes/user.routes.js'
import healthcheckRouter from "./routes/healthcheck.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"

//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter)
// app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)

app.get('/', (req, res) => {
    res.send('Hello, world!');
    console.log("hello world");
  });
// router Declaration
app.use('/api/v1/users', userRouter) // all the routes starting with /users will be handled by userRouter 
// It will become api/v1/users/register and api/v1/users/login etc...
// app.use()
export {app}