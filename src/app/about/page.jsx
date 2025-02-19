export default function About() {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center justify-center px-6 py-16'>
        <div className='max-w-5xl w-full bg-white p-10 rounded-2xl shadow-lg'>
          <h1 className='text-5xl font-extrabold text-blue-800 drop-shadow-md text-center mb-6'>
            About Our Digital Bus Pass System
          </h1>
  
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
            {/* Text Content */}
            <div>
              <ul className='list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-4'>
                <li>The Digital Bus Pass System offers a convenient and paperless solution for public transport.</li>
                <li>Users can easily apply, renew, and manage their bus passes online.</li>
                <li>Built with Next.js and MongoDB for seamless access and real-time updates.</li>
                <li>Secure authentication ensures safe and hassle-free commuting.</li>
                <li>Ideal for students, professionals, and frequent travelers.</li>
                <li>Provides flexibility to access bus passes anytime, anywhere.</li>
              </ul>
  
              <div className='mt-8'>
                <a
                  href='/apply-pass'
                  className='px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all'
                >
                  Apply for a Bus Pass
                </a>
              </div>
            </div>
  
            {/* Image Section */}
            <div className='flex justify-center items-center'>
              <img
                src='https://upload.wikimedia.org/wikipedia/commons/7/74/BMTC_Volvo_Bus.jpg'  // Bus Image
                alt='Bus Pass System'
                className='rounded-lg h-80 w-full object-cover shadow-md'
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  