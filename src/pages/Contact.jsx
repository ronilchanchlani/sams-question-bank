import React from 'react'

function Contact() {
  return (
    <div className='bg-gradient-to-b from-orange-100 to-orange-50 min-h-screen py-24 px-6 md:px-12'>
      <section className='max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border-2 border-orange-200'>
        <div className='bg-gradient-to-b from-orange-300 to-orange-200 p-6'>
          <h1 className='text-4xl md:text-5xl font-bold text-orange-800 text-center mb-4'>
            Contact Us!
          </h1>
        </div>
        <div className='flex flex-col md:flex-row items-center gap-8 md:gap-16 p-8 bg-orange-100'>
          <ul className='text-lg md:text-xl text-gray-700'>
            <li>
              <img src='/instagram-logo.png' alt='Instagram Logo' className='inline-block w-13 h-8 mr-2' />
              Instagram @uom_sams
            </li>
            <li>Follow us on social media for updates!</li>
          </ul>
        </div>
      </section>
    </div>
  )
}

export default Contact
