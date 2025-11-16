import { cx } from '@/utils/cx'
import { useId } from 'react'

export interface CheckboxProps {
  checked?: boolean
  label: string
  className?: string
  onChange: (checked: boolean) => void
}

export const Checkbox = ({
  checked,
  label,
  className,
  onChange,
}: CheckboxProps) => {
  const id = useId()
  return (
    <div className={cx('flex items-center', className)}>
      <input
        id={id}
        type="checkbox"
        className="h-4 w-4"
        onChange={e => onChange(e.target.checked)}
        checked={checked}
      />
      <label htmlFor={id} className="cursor-pointer pl-2">
        {label}
      </label>
    </div>
  )
}
