import { LayoutDashboard, Zap, Users, Lock, Monitor } from 'lucide-react'

const features = [
  { icon: Zap, label: 'Real-time collaboration' },
  { icon: Users, label: 'Team friendly' },
  { icon: Lock, label: 'Secure and reliable' },
  { icon: Monitor, label: 'Access anywhere' },
]

const columns = [
  { title: 'To Do', cards: ['Design homepage', 'Setup database'] },
  { title: 'In Progress', cards: ['Build login page'] },
  { title: 'Done', cards: ['Project setup', 'Wireframes'] },
]

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      {/* left side */}
      <div className="hidden lg:flex w-1/2 bg-blue-50 flex-col px-16 justify-center">
        <div className="max-w-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">CollabBoard</span>
          </div>

          <h2 className="mt-10 text-4xl font-bold leading-tight text-gray-900">
            Plan. Collaborate. Build. Together.
          </h2>

          <p className="mt-4 text-gray-600">
            A real-time collaborative board for teams, students and creators.
            Organize your work, share ideas and get things done together.
          </p>

          <div className="mt-8 grid grid-cols-4 gap-4">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.label} className="flex flex-col items-center gap-2 text-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
                    <Icon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <span className="text-xs text-gray-600">{f.label}</span>
                </div>
              )
            })}
          </div>

          <div className="relative mt-10">
            <div className="rounded-2xl bg-white p-4 shadow-lg ring-1 ring-gray-200">
              <div className="grid grid-cols-3 gap-3">
                {columns.map((col) => (
                  <div key={col.title} className="rounded-lg bg-gray-50 p-2">
                    <p className="mb-2 text-xs font-semibold text-gray-700">{col.title}</p>
                    <div className="space-y-2">
                      {col.cards.map((text) => (
                        <div
                          key={text}
                          className="rounded-md bg-white p-2 text-xs text-gray-600 shadow-sm ring-1 ring-gray-200"
                        >
                          {text}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -top-3 right-4 rounded-full bg-indigo-600 px-3 py-1 text-xs text-white shadow">
              Added new task
            </div>
          </div>
        </div>
      </div>

      {/* right side */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center">
        <div className="w-full max-w-sm px-6">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <LayoutDashboard className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">CollabBoard</span>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout