import { createFileRoute, redirect, useRouteContext } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/login' })
    }
  },
  component: Dashboard,
})

function Dashboard() {
  const { user } = useRouteContext({ from: '__root__' })

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Bienvenue, {user!.displayName}
          </h1>
          <p className="mt-1 text-gray-400">
            G&eacute;rez vos sessions de jeu et votre communaut&eacute;
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-purple-700 transition-colors"
        >
          Cr&eacute;er une session
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Game Sessions Section */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Mes sessions de jeu
          </h2>
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-gray-700">
            <p className="text-gray-500">Aucune session pour le moment</p>
          </div>
        </div>

        {/* Community Stats Section */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Stats communaut&eacute;
          </h2>
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-gray-700">
            <p className="text-gray-500">Aucune statistique disponible</p>
          </div>
        </div>
      </div>
    </div>
  )
}
