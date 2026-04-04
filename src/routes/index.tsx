import { createFileRoute, Link, useRouteContext } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { user } = useRouteContext({ from: '__root__' })

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
          Stream Friends
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-400">
          Organisez votre communaut&eacute;, jouez avec vos viewers
        </p>

        <div className="mt-10">
          {user ? (
            <Link
              to="/dashboard"
              className="inline-block rounded-lg bg-purple-600 px-8 py-3 text-lg font-semibold text-white shadow-lg hover:bg-purple-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <a
              href="/api/auth/twitch"
              className="inline-flex items-center gap-2 rounded-lg bg-[#9146FF] px-8 py-3 text-lg font-semibold text-white shadow-lg hover:bg-[#7c3aed] transition-colors"
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
              </svg>
              Se connecter avec Twitch
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
