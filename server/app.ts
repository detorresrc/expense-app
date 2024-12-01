import { swaggerUI } from '@hono/swagger-ui'
import { logger } from 'hono/logger'
import { expensesRoute } from './routes/expenses'
import { authRoute } from './routes/auth'
import { OpenAPIHono } from "@hono/zod-openapi"
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/bun'

const app = new OpenAPIHono()

app.use("*", logger())
app.use('*', cors({
    origin: 'http://localhost:5173',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  }))

app.get('/ui', swaggerUI({ url: '/doc' }))
app.doc("/doc", {
    openapi: "3.0.0",
    info: {
        version: "1.0.0",
        title: "My API",
    },
})

const apiRoutes = app.basePath("/api")
    .route("/expenses", expensesRoute)
    .route("/auth", authRoute)

app.use('*', serveStatic({ root: './frontend/dist' }))
app.use('*', serveStatic({ path: './frontend/dist/index.html' }))

export default app
export type ApiRoutes = typeof apiRoutes