import React from 'react'

const Footer = () => {
  return (
    <>
      <footer className="w-full mt-8 py-6 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-6xl mx-auto text-center text-[var(--color-text-secondary)] text-sm">
          © {new Date().getFullYear()} Podcastic | Kerri & Erik
        </div>
      </footer>
    </>
  )
}

export default Footer