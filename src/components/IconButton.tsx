import { motion } from 'framer-motion'
import React from 'react'

type IconButtonProps = {
  label?: string
  onClick?: () => void
  children: React.ReactNode
}

export default function IconButton({ label, onClick, children }: IconButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: 'inline-flex',
        gap: '0.5rem',
        alignItems: 'center',
        padding: '0.5rem 0.75rem',
        borderRadius: 8,
        border: '1px solid #e5e7eb',
        background: 'white',
        cursor: 'pointer',
      }}
    >
      {children}
      {label && <span>{label}</span>}
    </motion.button>
  )
}
