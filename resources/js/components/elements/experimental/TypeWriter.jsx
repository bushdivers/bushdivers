import React from 'react'

import { useTypewriter } from '../../../hooks/useTypeWriter'

const TypeWriter = ({ text, speed = 30 }) => {
  return <>{useTypewriter(text, speed)}</>
}

export default TypeWriter
