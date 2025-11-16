import {
  DateRangePicker,
  type DateRangePickerProps,
} from '../date-range-picker'
import { Input, type InputProps } from '../input'
import { Checkbox, type CheckboxProps } from '../checkbox'

export type FilterItemProps = (
  | ({
      type: 'text'
    } & InputProps)
  | ({
      type: 'date'
    } & DateRangePickerProps)
  | ({
      type: 'checkbox'
    } & CheckboxProps)
) & { title?: string; className?: string }

export const FilterItem = (props: FilterItemProps) => {
  const { className, title, type, ...rest } = props
  return (
    <div className={className}>
      {title && <p className="mb-2 text-lg font-bold">{title}</p>}
      {type === 'text' && <Input {...(rest as InputProps)} />}
      {type === 'date' && (
        <DateRangePicker {...(rest as DateRangePickerProps)} />
      )}
      {type === 'checkbox' && <Checkbox {...(rest as CheckboxProps)} />}
    </div>
  )
}
