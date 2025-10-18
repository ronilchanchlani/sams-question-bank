import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className='flex justify-between items-center px-6 py-4 bg-gradient-to-b from-orange-300 to-orange-200
        shadow-lg sticky top-0 z-50'>
        <div className='flex items-center space-x-3'>
            <img src='/logo.png' alt='logo' className='h-14 w-14 rounded-full'/>
            <span className='text-2xl font-extrabold text-orange-800'>
                South Asian Medical Society
            </span>
        </div>

        <ul className='flex space-x-8 text-lg font-semibold text-orange-900 pr-6'>
            <li>
                <Link to="/about" className='relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-red-500 after:transition-all after:duration-300 hover:after:w-full'>About</Link>
            </li>
            <li>
                <Link to="/resources" className='relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-red-500 after:transition-all after:duration-300 hover:after:w-full'>Resources</Link>
            </li>
            <li>
                <Link to="/questions" className='relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-red-500 after:transition-all after:duration-300 hover:after:w-full'>Question Banks</Link>
            </li>
            <li>
                <Link to="/contact" className='relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-red-500 after:transition-all after:duration-300 hover:after:w-full'>Contact</Link>
            </li>
        </ul>
    </nav>
  )
}