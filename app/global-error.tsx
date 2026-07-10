'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          padding: '0 24px',
        }}
      >
        <h1 style={{ fontSize: '1.75rem', margin: 0 }}>Something went wrong</h1>
        <p style={{ marginTop: '0.75rem', color: 'rgba(255,255,255,0.5)', maxWidth: 360 }}>
          A critical error occurred while loading the app. Please try again.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            marginTop: '2rem',
            height: '3rem',
            padding: '0 2rem',
            borderRadius: '9999px',
            backgroundColor: '#fff',
            color: '#000',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
