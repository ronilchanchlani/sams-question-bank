import React from 'react'

function About() {
  const renderLogoRain = () => {
    const logos = [];
    for (let i = 0; i < 32; i++) {
      const left = `${Math.random() * 100}%`;
      const animationDelay = `${Math.random() * 5}s`;
      const animationDuration = `${10 + Math.random() * 10}s`;
      const opacity = 0.2 + Math.random() * 0.3;
      const size = `${10 + Math.random() * 30}px`;

      logos.push(
        <img
          key={i}
          src='/logo.png'
          alt=''
          className='absolute pointer-events-none'
          style={{
            left,
            top: '-50px',
            width: size,
            height: 'auto',
            opacity,
            animation: `fall ${animationDuration} linear ${animationDelay} infinite`,
            zIndex: 0, // Logos should have lowest z-index
          }}
        />
      );
    }
    return logos;
  };

  const renderCulturalElements = () => {
    const rows = 10;
    const cols = 12;
    const elements = [];
    const motifs = ['🌸', '🏵️', '💮', '🍥'];
    const horizontalMargin = '10%';

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const size = `${10 + Math.random() * 15}px`
        const delay = `${(row * col * 0.1) + Math.random() * 2}s`
        const duration = `${8 + Math.random() * 10}s`

        elements.push(
          <div key={`grid-${row}-${col}`}
          className='absolute flex items-center justify-center text-xl opacity-20 hover:opacity-40 transition-opacity pointer-events-none'
          style={{
            left: `${(col / cols) * 100}%`,
            top: `${(row / rows) * 100}%`,
            width: size,
            height: size,
            animation: `float ${duration} ease-in-out ${delay} infinite alternate`,
            zIndex: 1
          }}>
            {motifs[(row + col) % motifs.length]}
          </div>
        )
      }
    }
    return elements;
  };

  return (
    <div className='bg-gradient-to-b from-orange-100 to-orange-50 min-h-screen py-24 px-6 md:px-12 relative overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-b from-orange-100 to-orange-50 z-0'></div>
      
      <div className='absolute inset-0 overflow-hidden z-10'>
        {renderLogoRain()}
      </div>

      <div className='absolute inset-0 overflow-hidden z-10'>
        {renderCulturalElements()}
      </div>
    
      <section className='max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border-2 border-orange-200 relative z-20'>
        <div className='bg-gradient-to-b from-orange-300 to-orange-200 p-6'>
          <h1 className='text-4xl md:text-5xl font-bold text-orange-800 text-center mb-4'>
            South Asian Medical Society
          </h1>
        </div>
        <div className='flex flex-col md:flex-row items-center gap-8 md:gap-16 p-8 bg-orange-100'>
          <p className='text-lg md:text-xl text-gray-700'>
            Welcome to SAMS @ UoM! 
            
            We founded this society to bring together South Asian medical students,
            creating a supportive space to connect, share experiences, and celebrate our culture. But this
            isn't just for South Asians - everyone is welcome!

            Our main focus is regular teaching sessions that go beyond traditional learning. We aim to
            provide interactive, engaging, and clinically relevant teaching that you might not usually get,
            alongside academic support tailored to help all students thrive.

            Stay tuned for weekly sessions, mentorship opportunities, and a strong community to support you
            throughout medical school!
          </p>
          <img src='/logo.png' alt='South Asian Medical Society Logo' className='w-1/4 h-auto rounded-lg'/>
        </div>
      </section>

      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-50px);
          }
          100% {
            transform: translateY(calc(100vh + 50px));
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
      `}</style>
    </div>
  )
}

export default About

