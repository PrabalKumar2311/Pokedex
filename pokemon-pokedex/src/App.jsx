import { useState } from 'react'
import './App.css'
import Pokemon from './Pokemon'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Pokemon/>
    </>
  )
}