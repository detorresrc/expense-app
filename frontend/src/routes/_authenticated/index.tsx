import App from '@/App'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/')({
  component: Home,
})

function Home() {
  return (
    <>
      <App />
    </>
  )
}
