import { Link, useRouter } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'

export function DefaultCatchBoundary({ error, reset }: ErrorComponentProps) {
  const router = useRouter()

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">Une erreur est survenue</h1>
        <p className="mt-4 text-gray-400">
          {error.message || "Quelque chose s'est mal passé."}
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            type="button"
            onClick={() => {
              reset()
              router.invalidate()
            }}
            className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
          >
            Réessayer
          </button>
          <Link
            to="/"
            className="rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-semibold text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
