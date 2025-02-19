export default function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center px-6 py-16'>
      <div className='max-w-5xl w-full bg-white p-10 rounded-2xl shadow-lg text-center'>
        <h1 className='text-5xl font-extrabold text-blue-800 drop-shadow-md mb-6'>
          Digital Bus Pass System
        </h1>
        <p className='text-gray-700 text-lg mb-6'>
          Experience a seamless and hassle-free way to apply for and renew your bus pass online. Say goodbye to long queues and paperwork—get your pass instantly with just a few clicks.
        </p>
        
        <img
          src='https://upload.wikimedia.org/wikipedia/commons/7/74/BMTC_Volvo_Bus.jpg' // Bus Image
          alt='Bus Pass Illustration'
          className='rounded-xl h-80 w-full object-cover mb-6 shadow-md'
        />

        <div className='space-y-4 text-gray-700 text-lg'>
          <p>🚍 Convenient and quick bus pass application</p>
          <p>🔹 Easy online renewal with secure payment</p>
          <p>🔹 Real-time updates on pass status</p>
          <p>🔹 Trusted by thousands of daily commuters</p>
        </div>

        <div className='mt-8 space-x-4'>
          <a
            href='/apply-pass'
            className='px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all'
          >
            Apply for Pass
          </a>
          <a
            href='/renew-pass'
            className='px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all'
          >
            Renew Pass
          </a>
        </div>

        <div className='mt-10 text-gray-700 text-lg'>
          <p>Need assistance? Contact our support team for any queries.</p>
        </div>
      </div>
    </div>
  );
}
