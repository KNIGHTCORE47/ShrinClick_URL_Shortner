import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import ConnectDB from './src/database/db_config.js';
import urlRoutes from './src/routes/url.routes.js'
import authRoutes from './src/routes/auth.routes.js'
import { catchError } from './src/utility/nodeUtility.js';
import { isNotAuthenticated } from './src/middleware/auth.middleware.js';

await ConnectDB();

const app = express();
const port = process.env.PORT.toString() || 3000;


// NOTE - Middleware [Security, CORS, Logging, Authentication, Authorization, etc]

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json({
    limit: '50mb'
}));

app.use(express.urlencoded({
    limit: '50mb',
    extended: true
}));

app.use(cookieParser());

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Allow-Origin',
        'device-remember-token'
    ]
}));


// NOTE - Routes
app.get('/', (request, response) => {
    response
        .status(200)
        .json({
            success: true,
            message: 'Hello World'
        });
});

// app.use(isNotAuthenticated);

app.use("/api/auth", authRoutes);
app.use("/api/v1", urlRoutes);


// NOTE - Middleware [Error Handler]
app.use(catchError);

// NOTE - Server [Start]
app.listen(port, function () {
    console.log(`Server is running on port: http://localhost:${port}`);
});
