/// <reference types="vite/client" />

declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.svg?react' {
  import React from 'react'
  const content: React.ComponentType<React.SVGProps<SVGSVGElement>>
  export default content
}
