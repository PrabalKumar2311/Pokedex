import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className='navbar'>
      <div className='nav-background-card'>

        <div className='nav-card'>
          <NavLink 
            className={({ isActive }) => 
              isActive ? "links active" : "links"
            }
            to='/'
          >
            Pokedex
          </NavLink>
        </div>

        <div className='nav-card'>
          <NavLink 
            className={({ isActive }) => 
              isActive ? "links active" : "links"
            }
            to='/favourites'
          >
            Favourites
          </NavLink>
        </div>

      </div>
    </nav>
  )
}
