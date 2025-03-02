import React from 'react';
import { ArrowRight, Clock, CreditCard, Bell, Shield, MapPin, Smartphone, ClipboardCheck, CheckCircle } from 'lucide-react';

const Hero = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        {/* Left Section */}
        <div className="text-center md:text-left flex-1">
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-800 leading-tight mb-6">
            Your Digital <span className="text-blue-600">Bus Pass</span> Solution
          </h1>
          <p className="text-gray-700 text-lg mb-8 max-w-lg mx-auto md:mx-0">
            Experience a seamless and hassle-free way to apply for and renew your bus pass online. Say goodbye to long queues and paperwork.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href="/apply-pass"
              className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all flex items-center justify-center"
            >
              Apply for Pass
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a
              href="/ticket"
              className="px-6 py-3 bg-white text-blue-600 border border-blue-600 text-lg font-semibold rounded-lg shadow-sm hover:bg-blue-50 transition-all"
            >
              Buy Ticket
            </a>
          </div>
        </div>
        
        {/* Right Section */}
        <div className="relative flex-1 flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
            alt="Modern city bus"
            width={600}
            height={400}
            className="w-auto h-[400px] object-cover rounded-lg"
           
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Why Choose Our Digital Bus Pass</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[{ icon: <Clock className="h-6 w-6 text-blue-600" />, title: "Quick Application", desc: "Apply for your bus pass in minutes, not hours." },
            { icon: <CreditCard className="h-6 w-6 text-blue-600" />, title: "Secure Payments", desc: "Make payments with confidence using secure payment gateways." },
            { icon: <Bell className="h-6 w-6 text-blue-600" />, title: "Real-time Updates", desc: "Receive instant notifications on your application status." },
            { icon: <Shield className="h-6 w-6 text-blue-600" />, title: "Verified Security", desc: "Your data is protected with enterprise-grade security." },
            { icon: <MapPin className="h-6 w-6 text-blue-600" />, title: "Route Planning", desc: "Access detailed route information and plan your journey." },
            { icon: <Smartphone className="h-6 w-6 text-blue-600" />, title: "Mobile Friendly", desc: "Access your digital bus pass anytime, anywhere." }].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 p-3 rounded-full w-fit mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="w-full max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[{ icon: <ClipboardCheck className="h-10 w-10 text-blue-600" />, title: "Apply Online", desc: "Fill out our simple online application form." },
            { icon: <CreditCard className="h-10 w-10 text-blue-600" />, title: "Make Payment", desc: "Choose a payment method and complete the transaction." },
            { icon: <Smartphone className="h-10 w-10 text-blue-600" />, title: "Receive Digital Pass", desc: "Get your pass delivered via email or in your account." },
            { icon: <CheckCircle className="h-10 w-10 text-blue-600" />, title: "Start Using", desc: "Show your digital pass on your phone or print it." }].map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-50 rounded-full p-6 mx-auto w-24 h-24 flex items-center justify-center mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;