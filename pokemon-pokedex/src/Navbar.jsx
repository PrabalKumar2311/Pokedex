import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className='navbar'>
      <div className='nav-background-card'>
          <div className='nav-card'>
            <Link className='links'
            to='/'>
              Pokedex
            </Link>
          </div>

          <div className='nav-card'>
            <Link className='links' 
            to='/favourites'>
              Favourites
            </Link>
          </div>
            
        </div>
    </nav>
  )
}
