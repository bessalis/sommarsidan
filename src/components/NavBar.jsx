import { useNavigate, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', icon: '⌂', label: 'Hem' },
  { path: '/logga', icon: '✎', label: 'Logga' },
  { path: '/bocker', icon: '□', label: 'Böcker' },
  { path: '/badges', icon: '◎', label: 'Bragder' },
]

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 430,
      background: '#F2ECD7',
      borderTop: '1px solid #ddd6c1',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '12px 0 20px',
      zIndex: 100,
    }}>
      {navItems.map(item => {
        const active = location.pathname === item.path
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              color: active ? 'var(--green)' : 'var(--text-muted)',
              fontSize: 12,
              fontFamily: '-apple-system, sans-serif',
            }}
          >
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <span style={{ fontWeight: active ? 600 : 400 }}>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}