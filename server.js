import express, { urlencoded } from 'express'
import doteenv from 'dotenv'
import userRoutes from './routes/userRoutes.js'
import adminRouter from './routes/adminRoutes.js'
import { notFound,errorHandler } from './middleware/errorMiddleware.js'
import conectDb from './config/db.js'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import cors from 'cors';

const app = express();

// CORS setup
const corsOptions = {
    origin: ["https://vocalize-manager-frontend-1b.vercel.app","http://localhost:5000"],
    methods: ["GET", "PATCH", "PUT", "POST", "DELETE"],
    optionsSuccessStatus: 204,
  };
  
  app.use(cors(corsOptions));
  app.use(morgan("dev"));

doteenv.config()

conectDb(); 

const port = process.env.PORT || 5000



app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use(cookieParser())  

app.use('/api/users',userRoutes)

app.use('/api/admin',adminRouter)

app.get('/', (req, res)=> res.send('Server is redy'));

app.use(notFound)
app.use(errorHandler)

app.listen(port, ()=> console.log(`Server is running on port ${port}`));
