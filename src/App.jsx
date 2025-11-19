import Header from './components/Header'
import Players from './components/Players'
import Matches from './components/Matches'
import Stats from './components/Stats'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen p-6 sm:p-10">
        <div className="max-w-6xl mx-auto space-y-8">
          <Header />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Players />
            <Matches />
          </div>
          <Stats />
        </div>
      </div>
    </div>
  )
}

export default App
