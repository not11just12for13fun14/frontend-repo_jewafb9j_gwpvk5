import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Matches() {
  const [matches, setMatches] = useState([])
  const [form, setForm] = useState({ opponent: '', date: '', home: true, team_score: '', opponent_score: '' })
  const [loading, setLoading] = useState(false)

  const load = async () => {
    const res = await fetch(`${API}/api/matches`)
    const data = await res.json()
    setMatches(data.sort((a,b)=> new Date(b.date) - new Date(a.date)))
  }

  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch(`${API}/api/matches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opponent: form.opponent,
          date: new Date(form.date).toISOString(),
          home: form.home,
          team_score: form.team_score === '' ? null : Number(form.team_score),
          opponent_score: form.opponent_score === '' ? null : Number(form.opponent_score),
          notes: null
        })
      })
      setForm({ opponent: '', date: '', home: true, team_score: '', opponent_score: '' })
      await load()
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold text-lg">Matches</h2>
      </div>
      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-6 gap-3 mb-4">
        <input className="px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700" placeholder="Opponent" value={form.opponent} onChange={e=>setForm({...form,opponent:e.target.value})} />
        <input type="datetime-local" className="px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} />
        <label className="flex items-center gap-2 text-blue-200/80">
          <input type="checkbox" checked={form.home} onChange={e=>setForm({...form,home:e.target.checked})} /> Home
        </label>
        <input className="px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700" placeholder="Team score" value={form.team_score} onChange={e=>setForm({...form,team_score:e.target.value})} />
        <input className="px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700" placeholder="Opponent score" value={form.opponent_score} onChange={e=>setForm({...form,opponent_score:e.target.value})} />
        <button disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white rounded px-4 py-2 disabled:opacity-50">Add</button>
      </form>
      <div className="grid gap-2">
        {matches.map(m => (
          <div key={m.id} className="flex items-center justify-between bg-slate-900/40 border border-slate-700 rounded p-3">
            <div>
              <p className="text-white font-medium">{new Date(m.date).toLocaleString()} vs {m.opponent} {m.home ? '(Home)' : '(Away)'} </p>
              <p className="text-blue-200/70 text-sm">Score: {m.team_score ?? '-'} : {m.opponent_score ?? '-'}</p>
            </div>
            <span className="text-blue-200/60 text-xs">ID: {m.id}</span>
          </div>
        ))}
        {matches.length === 0 && <p className="text-blue-200/70">No matches yet</p>}
      </div>
    </section>
  )
}

export default Matches
