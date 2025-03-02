"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Bus, MapPin, Clock, Shield, CreditCard, Leaf, Smartphone } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-200 py-16 px-4 sm:px-6">
      <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-full">
        {/* Header with background image */}
        <div className="relative h-80 w-full">
          <Image
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="City bus transportation"
            layout="fill"
            objectFit="cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white p-8">
              About Our Digital Bus Pass System
            </h1>
          </div>
        </div>

        <div className="p-6 md:p-10 flex-grow flex flex-col justify-center">
          {/* Main content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Left column - Text content */}
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Our Digital Bus Pass System revolutionizes public transportation by offering a seamless, 
                paperless solution for commuters. Designed with convenience and efficiency in mind, 
                our platform makes traveling easier than ever before.
              </p>

              <div className="space-y-4">
                {[{ icon: Bus, title: "Convenient Access", desc: "Apply, renew, and manage your bus passes online without paperwork." },
                  { icon: Clock, title: "Real-time Updates", desc: "Built with Next.js and MongoDB for seamless access and instant updates." },
                  { icon: Shield, title: "Secure Authentication", desc: "Advanced security ensures your information remains protected." },
                  { icon: MapPin, title: "Anywhere Access", desc: "Access your bus pass from any device, anytime, anywhere." }].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <feature.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link 
                  href="/apply-pass" 
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg shadow-md hover:bg-blue-700 transition-all"
                >
                  Apply for a Bus Pass
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right column - Images */}
            <div className="rounded-xl overflow-hidden shadow-md w-full">
              <Image
                src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
                alt="Modern city bus"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-blue-50 py-16 px-6 text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-6">Why Choose Digital Bus Passes?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[{ icon: Leaf, title: "Eco-Friendly", desc: "Reduce paper waste and your carbon footprint with our paperless solution." },
              { icon: Clock, title: "Time-Saving", desc: "Skip the lines and tap to board with our quick digital verification system." },
              { icon: Smartphone, title: "Convenient", desc: "Manage all your passes, view schedules, and get updates right from your phone." }].map((benefit, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                  <benefit.icon className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}