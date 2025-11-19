import { useMemo } from 'react'

function Header() {
  const tips = useMemo(() => [
    'Add players with jersey numbers first',
    'Create matches with date and opponent',
    'Record statlines per player after each game',
  ], [])

  return (
    <header className="mb-8">
      <h1 className="text-4xl font-bold text-white">Team Dashboard</h1>
      <p className="text-blue-200/90 mt-2">Track matches, players, and game stats</p>
      <ul className="mt-4 text-sm text-blue-200/70 list-disc list-inside">
        {tips.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </header>
  )
}

export default Header
