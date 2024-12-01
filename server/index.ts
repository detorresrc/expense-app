import app from './app'

const port = 3000
Bun.serve({
    fetch: app.fetch,
    port
})