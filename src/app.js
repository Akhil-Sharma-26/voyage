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

app.get('/', (req, res) => {
    res.send('Hello, world!');
    console.log("hello world");
  });
// router Declaration
app.use('/api/v1/users', userRouter) // all the routes starting with /users will be handled by userRouter 
// It will become api/v1/users/register and api/v1/users/login etc...
// app.use()
export {app}