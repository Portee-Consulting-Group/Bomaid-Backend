const express = require('express');
const connectDB = require('./src/common/db.js');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
var socketIO = require('socket.io');
var http = require('http');
const passport = require('passport');
const { invalidOtpCronJob } = require('./src/services/CronJobService.js');


setEnvironment();
connectDB();

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const PORT = process.env.PORT || 5000;
//swagger config
let swaggerUrl = `${process.env.BASE_URL}:${PORT}`;
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Bomaid API',
            description: 'Bomaid api documentation',
            contact: {
                name: 'Mizi'
            },
            servers: [`${swaggerUrl}`]
        }
    },
    components: {
        securitySchemes: {
            jwt: {
                type: "Authorization",
                scheme: "Bearer",
                in: "header",
                bearerFormat: "JWT"
            }
        }
    },
    security: [{
        jwt: []
    }],
    apis: ['./src/routes/*.js']
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/ms/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.static(__dirname));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: false,
    }));

// Passport session setup.
passport.serializeUser(function (user, done) {
    console.log('serialize user', user);
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    console.log('deserialize user', user);
    done(null, obj);
});



//setup socket connection
var server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});


//handles both express and socke.io
server.listen(process.env.PORT, function () {
    console.log(`Server running in ${process.env.NODE_ENV} on port ${process.env.PORT}`);
});

//routes config

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello World!' });
});

app.get('/email', (req, res) => {
    const email = require('./src/services/EmailService')
    email.Test();
    res.sendStatus(200)
});

//define routes
const AuthRouter = require('./src/routes/authRoutes');
const UserRouter = require('./src/routes/userRoutes');
const OtpRouter = require('./src/routes/otpRoutes');
const GoalTypeRouter =require('./src/routes/goalTypeRoutes');
const UserGoalRouter = require('./src/routes/userGoalRoutes');
const CircleRouter = require('./src/routes/circleRoutes');
const FitRouter = require('./src/routes/fitRoutes');
const SurveyRouter = require('./src/routes/surveyRoutes');

UserRouter.routesConfig(app);
AuthRouter.routesConfig(app);
OtpRouter.routesConfig(app);
GoalTypeRouter.routesConfig(app);
UserGoalRouter.routesConfig(app);
CircleRouter.routesConfig(app);
FitRouter.routesConfig(app);
SurveyRouter.routesConfig(app);
//Cron jobs
invalidOtpCronJob;

function setEnvironment() {

    if (process.env.NODE_ENV === 'production') {
        dotenv.config({ path: './config/config.env' });
    } else if (process.env.NODE_ENV === 'development') {
        dotenv.config({ path: './config/config.test.env' });
    }
}