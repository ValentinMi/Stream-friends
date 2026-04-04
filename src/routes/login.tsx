import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl bg-gray-900 p-8 shadow-xl border border-gray-800">
        <h1 className="mb-2 text-center text-2xl font-bold text-white">
          Connexion
        </h1>
        <p className="mb-8 text-center text-sm text-gray-400">
          Connectez-vous pour rejoindre des sessions de jeu
        </p>

        <a
          href="/api/auth/twitch"
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#9146FF] px-4 py-3 font-semibold text-white shadow hover:bg-[#7c3aed] transition-colors"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
          </svg>
          Se connecter avec Twitch
        </a>
      </div>
    </div>
  )
}
