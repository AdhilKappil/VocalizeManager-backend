import express from 'express'
import doteenv from 'dotenv'
import { notFound,errorHandler } from './middleware/errorMiddleware.js'
import conectDb from './config/db.js'
import cookieParser from 'cookie-parser'



doteenv.config()

conectDb();  

const port = process.env.PORT || 5000

const app = express();
  
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use(cookieParser())  

app.use(notFound)
app.use(errorHandler)

app.get('/', (req, res)=> res.send('Server is redy'));


app.listen(port, ()=> console.log(`Server is running on port ${port}`));
