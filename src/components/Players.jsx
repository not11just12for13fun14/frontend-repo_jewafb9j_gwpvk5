import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Players() {
  const [players, setPlayers] = useState([])
  const [form, setForm] = useState({ name: '', number: '', position: '' })
  const [loading, setLoading] = useState(false)

  const load = async () => {
    const res = await fetch(`${API}/api/players`)
    const data = await res.json()
    setPlayers(data)
  }

  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch(`${API}/api/players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          number: Number(form.number || 0),
          position: form.position || null,
        })
      })
      setForm({ name: '', number: '', position: '' })
      await load()
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold text-lg">Players</h2>
      </div>
      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
        <input className="px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input className="px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700" placeholder="Number" value={form.number} onChange={e=>setForm({...form,number:e.target.value})} />
        <input className="px-3 py-2 rounded bg-slate-900/60 text-white border border-slate-700" placeholder="Position" value={form.position} onChange={e=>setForm({...form,position:e.target.value})} />
        <button disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white rounded px-4 py-2 disabled:opacity-50">Add</button>
      </form>
      <div className="grid gap-2">
        {players.map(p => (
          <div key={p.id} className="flex items-center justify-between bg-slate-900/40 border border-slate-700 rounded p-3">
            <div>
              <p className="text-white font-medium">#{p.number} {p.name}</p>
              {p.position && <p className="text-blue-200/70 text-sm">{p.position}</p>}
            </div>
            <span className="text-blue-200/60 text-xs">ID: {p.id}</span>
          </div>
        ))}
        {players.length === 0 && <p className="text-blue-200/70">No players yet</p>}
      </div>
    </section>
  )
}

export default Players
