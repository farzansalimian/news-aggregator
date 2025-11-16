import { useState } from 'react'
import imagePlaceholder from './placeholder.png'
import { cx } from '@/utils/cx'

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  placeholder?: React.ReactNode
}

export const Image = ({
  src,
  alt,
  placeholder,
  width,
  height,
  ...props
}: ImageProps) => {
  const [error, setError] = useState(false)

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {!error && src ? (
        <img
          {...props}
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setError(true)}
          style={{
            width,
            height,
            objectFit: 'cover',
          }}
          className={cx('bg-gray-200', props.className)}
        />
      ) : (
        <div className="placeholder">
          {placeholder || (
            <img
              {...props}
              loading="lazy"
              src={imagePlaceholder}
              alt={'image placeholder'}
              className={cx('bg-gray-200', props.className)}
              style={{
                width,
                height,
                objectFit: 'cover',
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}
