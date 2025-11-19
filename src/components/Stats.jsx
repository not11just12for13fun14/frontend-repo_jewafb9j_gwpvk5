import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Stats() {
  const [matches, setMatches] = useState([])
  const [players, setPlayers] = useState([])
  const [statlines, setStatlines] = useState([])
  const [form, setForm] = useState({ match_id: '', player_id: '', points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0, turnovers: 0 })
  const [loading, setLoading] = useState(false)

  const load = async () => {
    const [mRes, pRes] = await Promise.all([
      fetch(`${API}/api/matches`),
      fetch(`${API}/api/players`)
    ])
    const [m, p] = await Promise.all([mRes.json(), pRes.json()])
    setMatches(m)
    setPlayers(p)
    if (m.length && !form.match_id) setForm(f => ({ ...f, match_id: m[0].id }))
    if (p.length && !form.player_id) setForm(f => ({ ...f, player_id: p[0].id }))
  }

  const loadStats = async () => {
    if (!form.match_id) return
    const res = await fetch(`${API}/api/stats/by-match/${form.match_id}`)
    const data = await res.json()
    setStatlines(data)
  }

  useEffect(() => { load() }, [])
  useEffect(() => { loadStats() }, [form.match_id])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch(`${API}/api/stats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, points: Number(form.points||0), rebounds: Number(form.rebounds||0), assists: Number(form.assists||0), steals: Number(form.steals||0), blocks: Number(form.blocks||0), turnovers: Number(form.turnovers||0) })
      })
      setForm(f => ({ ...f, points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0, turnovers: 0 }))
      await loadStats()
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold text-lg">Stats</h2>
      </div>
      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-8 gap-3 mb-4">
        <select className="px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700" value={form.match_id} onChange={e=>setForm({...form,match_id:e.target.value})}>
          {matches.map(m => (
            <option key={m.id} value={m.id}>{new Date(m.date).toLocaleDateString()} vs {m.opponent}</option>
          ))}
        </select>
        <select className="px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700" value={form.player_id} onChange={e=>setForm({...form,player_id:e.target.value})}>
          {players.map(p => (
            <option key={p.id} value={p.id}>#{p.number} {p.name}</option>
          ))}
        </select>
        {['points','rebounds','assists','steals','blocks','turnovers'].map(k => (
          <input key={k} className="px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700" placeholder={k} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} />
        ))}
        <button disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white rounded px-4 py-2 disabled:opacity-50">Add</button>
      </form>
      <div className="grid gap-2">
        {statlines.map(s => (
          <div key={s.id} className="bg-slate-900/40 border border-slate-700 rounded p-3">
            <p className="text-white font-medium">Player: {players.find(p=>p.id===s.player_id)?.name || s.player_id}</p>
            <p className="text-blue-200/80 text-sm">PTS {s.points} • REB {s.rebounds} • AST {s.assists} • STL {s.steals} • BLK {s.blocks} • TO {s.turnovers}</p>
          </div>
        ))}
        {statlines.length === 0 && <p className="text-blue-200/70">No stats for selected match</p>}
      </div>
    </section>
  )
}

export default Stats
