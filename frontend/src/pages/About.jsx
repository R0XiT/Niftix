import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from '../components/Navbar';

const About = () => {
    useEffect(() => {
        AOS.init({ once: true });
    }, []);

    return (
        <div className="flex flex-col bg-black">
            <Navbar />
            <div className="">
                <main className="max-w-4xl mx-auto px-6 py-16 space-y-16">
                    {/* About Us */}
                    <section data-aos="fade-up" data-aos-duration="900">
                        <h2 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-4">About Us</h2>
                        <p className="text-gray-300 leading-relaxed text-lg">
                            Welcome to <span className="font-bold text-white">Niftix</span> – a decentralized ticketing platform built to redefine event experiences.<br /><br />
                            We’re here to change the way tickets are created, sold, and exchanged — all powered by blockchain technology.<br /><br />
                            Say goodbye to fake tickets, overpriced resales, and hefty platform fees. At Niftix, each ticket is minted as an NFT, giving users true ownership and the freedom to resell fairly in a peer-to-peer marketplace.
                        </p>
                    </section>

                    {/* What We Stand For */}
                    <section data-aos="zoom-in" data-aos-duration="1000">
                        <h2 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-4">What We Stand For</h2>
                        <ul className="space-y-4 text-lg text-gray-300 list-disc list-inside">
                            <li><strong className="text-white"> Security & Authenticity</strong> – Every ticket is verified on-chain, eliminating fraud.</li>
                            <li><strong className="text-white"> Fair Resale</strong> – Resell directly with no middlemen or inflated pricing.</li>
                            <li><strong className="text-white"> Decentralized by Design</strong> – Ownership and control belong to the users, not the platform.</li>
                            <li><strong className="text-white"> Simple, Fast, and User-Friendly</strong> – Cutting-edge tech, built for everyone.</li>
                        </ul>
                    </section>

                    {/* Built by Enthusiasts */}
                    <section data-aos="fade-up" data-aos-duration="1100">
                        <h2 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-4">Built by Enthusiasts</h2>
                        <p className="text-gray-300 leading-relaxed text-lg">
                            We're a passionate group of students and developers dedicated to fairness, transparency, and technology.
                            Our mission? To rebuild trust in the ticketing world — one line of code at a time.
                        </p>
                    </section>
                </main>
            </div>
        </div>

    );
};

export default About;
