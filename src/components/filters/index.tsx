import { FilterItem, type FilterItemProps } from './item'

interface FiltersProps {
  items: FilterItemProps[]
}

export const Filters = ({ items }: FiltersProps) => {
  return items.map((item, index) => (
    <FilterItem className="mb-2" key={index} {...item} />
  ))
}
