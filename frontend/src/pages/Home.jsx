import React from 'react'

import Spline from '@splinetool/react-spline';
import { Typewriter } from 'react-simple-typewriter';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';




const Home = () => {
    
    const navigate = useNavigate();

    return (
        <div className='h-full bg-black '>
            <div className="bg-black h-full text-white font-mono">
                <Navbar />

                {/* Hero Section */}

                <main className="flex h-screen flex-wrap md:flex-nowrap items-center justify-between max-w-7xl mx-auto px-6 py-20">
                    {/* Left Content */}
                    <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Experience the
                        </h1>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            <span className="text-cyan-400">
                                <Typewriter
                                    words={['Decentralized', 'Secure', 'Transparent', 'On-Chain']}
                                    loop={0} // 0 = infinite
                                    cursor
                                    cursorStyle="|"
                                    typeSpeed={100}
                                    deleteSpeed={70}
                                    delaySpeed={1500}
                                />
                            </span>
                        </h1>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">Events Like Never Before</h1>
                        <p className="text-gray-400 text-lg">
                            Your gateway to transparent, decentralized event access. Own your tickets, verify authenticity, and join the future.
                        </p>
                        <div>
                            <div
                                className={"bg-cyan-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-cyan-500 transition w-[150px] hover:cursor-pointer"}
                                onClick={() => navigate("/events")}
                            >
                                Get Tickets
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="w-full md:w-1/2 mt-10 md:mt-0 relative">
                        <img
                            src="https://images.unsplash.com/photo-1623776054350-fd184b91bb1f?auto=format&fit=crop&w=800&q=80"
                            alt="Event Preview"
                            className="rounded-xl shadow-2xl w-full"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-xl"></div>
                    </div>
                </main>
                <div className='absolute z-10 top-[20%] h-[1000px] w-[1000px] left-[55%]'>
                    <div className="relative h-[7%] w-[90%] top-[50%] bg-black"></div>
                    <main>
                        <Spline
                            scene="https://prod.spline.design/cCuSjVfdd-Wlhb99/scene.splinecode"
                        />
                    </main>
                </div>

            </div>

        </div>
    )
}

export default Home
