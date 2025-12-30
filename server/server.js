import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import connectCloudinary from './configs/cloudinary.js'
import userRouter from './routes/userRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import courseRouter from './routes/courseRoute.js'

// import bodyParser from 'body-parser';

// Initialize Express
const app = express()

// Connect to database
await connectDB()
await connectCloudinary()

// app.post('/clerk', bodyParser.raw({ type: 'application/json' }), clerkWebhooks);
app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebhooks);
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// Middlewares
app.use(cors())
// app.use(clerkMiddleware())

// Routes
app.get('/', (req, res) => res.send("API Working"))
// app.post('/clerk', express.json() , clerkWebhooks)
// app.post('/clerk', bodyParser.raw({ type: 'application/json' }), clerkWebhooks);
// app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)
app.use('/api/educator', clerkMiddleware(), express.json(), educatorRouter)
app.use('/api/course', clerkMiddleware(), express.json(), courseRouter)
app.use('/api/user', clerkMiddleware(), express.json(), userRouter)

// Port
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})