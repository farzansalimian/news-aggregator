import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export interface DateRangePickerProps {
  startDate?: Date | null
  endDate?: Date | null
  onChange: (dates: [Date | null, Date | null]) => void
}
export const DateRangePicker = ({
  startDate,
  endDate,
  onChange,
}: DateRangePickerProps) => {
  return (
    <DatePicker
      selected={startDate}
      onChange={onChange}
      startDate={startDate}
      endDate={endDate}
      selectsRange
      showIcon
      className="w-full rounded-md border border-gray-300"
      wrapperClassName="w-full"
      shouldCloseOnSelect
    />
  )
}
