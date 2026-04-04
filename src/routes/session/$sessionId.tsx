import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { db } from '~/server/db'
import { gameSessions, registrations } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

const fetchSession = createServerFn({ method: 'GET' })
  .validator((sessionId: string) => sessionId)
  .handler(async ({ data: sessionId }) => {
    const session = await db.query.gameSessions.findFirst({
      where: eq(gameSessions.id, sessionId),
      with: {
        streamer: {
          columns: { displayName: true },
        },
        registrations: true,
      },
    })

    if (!session) return null
    return session
  })

export const Route = createFileRoute('/session/$sessionId')({
  loader: ({ params }) => fetchSession({ data: params.sessionId }),
  component: SessionPage,
})

function SessionPage() {
  const session = Route.useLoaderData()

  if (!session) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">Session introuvable</h1>
          <p className="mt-4 text-gray-400">
            Cette session n'existe pas ou a été supprimée.
          </p>
        </div>
      </div>
    )
  }

  const registrationCount = session.registrations.length
  const statusLabels: Record<string, string> = {
    open: 'Ouverte',
    closed: 'Ferm\u00e9e',
    in_progress: 'En cours',
    completed: 'Termin\u00e9e',
  }
  const statusColors: Record<string, string> = {
    open: 'bg-green-600',
    closed: 'bg-red-600',
    in_progress: 'bg-yellow-600',
    completed: 'bg-gray-600',
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">{session.game}</h1>
            <p className="mt-1 text-gray-400">
              par {session.streamer.displayName}
            </p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-white ${statusColors[session.status] ?? 'bg-gray-600'}`}
          >
            {statusLabels[session.status] ?? session.status}
          </span>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-gray-800 bg-gray-950 p-4 text-center">
            <p className="text-sm text-gray-400">Joueurs max</p>
            <p className="mt-1 text-2xl font-bold text-white">
              {session.maxPlayers}
            </p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-950 p-4 text-center">
            <p className="text-sm text-gray-400">Inscrits</p>
            <p className="mt-1 text-2xl font-bold text-white">
              {registrationCount}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white shadow hover:bg-purple-700 transition-colors"
        >
          S'inscrire
        </button>
      </div>
    </div>
  )
}
