import { getUser } from '@/services/auth/session'
import { logout } from '@/services/auth/logout'
import { Button } from '@/shared/components/ui/button'

export default async function DashboardPage() {
  const user = await getUser()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Selamat datang, {user?.email}!</p>
      <form action={logout}>
        <Button type="submit">Logout</Button>
      </form>
    </div>
  )
}
