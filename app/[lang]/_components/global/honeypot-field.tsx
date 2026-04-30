import type { Ref } from 'react'

type Props = {
  ref?: Ref<HTMLInputElement>
}

export default function HoneypotField({ ref }: Props) {
  return (
    <div
      aria-hidden='true'
      style={{
        position: 'absolute',
        left: '-9999px',
        width: '1px',
        height: '1px',
        overflow: 'hidden'
      }}
    >
      <label>
        Website
        <input
          ref={ref}
          type='text'
          name='website'
          tabIndex={-1}
          autoComplete='off'
          defaultValue=''
        />
      </label>
    </div>
  )
}
