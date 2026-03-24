import cors from 'cors'
import express from 'express'
import systemRoutes from './routes/systemRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/system', systemRoutes)

app.listen(PORT, () => {
  console.log(`API ready on http://localhost:${PORT}`)
})
