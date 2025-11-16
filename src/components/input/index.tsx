import { useId } from 'react'

export interface InputProps {
  value: string
  onChange: (value: string) => void
  label?: string
}
export const Input = ({ value, onChange, label }: InputProps) => {
  const id = useId()
  return (
    <div>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 p-2"
      />
    </div>
  )
}
