import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-white">
          Page introuvable
        </h2>
        <p className="mt-2 text-gray-400">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}
