import React, {useContext } from 'react'
import { ethers } from 'ethers';
import UserContext from '../context/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {

    const { user, setUser } = useContext(UserContext);
    const location = useLocation();
    const currentPath = location.pathname;
    const navigate = useNavigate();


    async function requestAccount() {
        console.log('Requesting account...');

        if (window.ethereum) {
            console.log('detected');

            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });

                setUser(accounts[0]);
            } catch (error) {
                console.log('Error connecting...', error);
            }

        } else {
            alert('Meta Mask not detected');
        }
    }
    async function connectWallet() {
        if (typeof window.ethereum !== 'undefined') {
            await requestAccount();

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            if (!provider) {
                console.log('No provider found');
                return;
            }
        }
    }
    return (

        <header className="sticky top-0 z-50 backdrop-blur-md bg-black/60 border-b border-gray-700">
            <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
                {/* Logo */}
                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 relative">
                    Niftix
                </div>

                {/* Navigation Links */}
                <div className="flex items-center space-x-6 text-white font-semibold">
                    <div
                        className={`hover:text-cyan-400 transition cursor-pointer ${currentPath === "/" ? "text-cyan-400" : "text-white"
                            }`}
                        onClick={() => navigate("/")}
                    >
                        Home
                    </div>
                    <div
                        className={`hover:text-cyan-400 transition cursor-pointer ${currentPath === "/about" ? "text-cyan-400" : "text-white"
                            }`}
                        onClick={() => navigate("/about")}
                    >
                        About
                    </div>
                    <div
                        className={`hover:text-cyan-400 transition cursor-pointer ${currentPath === "/events" ? "text-cyan-400" : "text-white"
                            }`}
                        onClick={() => navigate("/events")}
                    >
                        Events
                    </div>
                    <div
                        className={`hover:text-cyan-400 transition cursor-pointer ${currentPath === "/create" ? "text-cyan-400" : "text-white"
                            }`}
                        onClick={() => navigate("/create")}
                    >
                        Create
                    </div>
                    <div
                        className={`hover:text-cyan-400 transition cursor-pointer ${currentPath === "/tickets" ? "text-cyan-400" : "text-white"
                            }`}
                        onClick={() => navigate("/tickets")}
                    >
                        Tickets
                    </div>
                    {
                        !user &&
                        <button className="bg-cyan-400 text-black px-4 py-2 rounded-xl font-bold hover:bg-cyan-700 transition flex items-center space-x-2 cursor-pointer "
                            onClick={connectWallet}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M12 11c0 2.21-1.79 4-4 4H5v3h3c3.31 0 6-2.69 6-6 0-.34-.03-.67-.08-1H12z" />
                                <path d="M17.66 5.93l-1.41 1.41a4.01 4.01 0 010 5.66l1.41 1.41a6.007 6.007 0 000-8.48z" />
                                <path d="M19.07 4.5A9.969 9.969 0 0121 12c0 2.21-.72 4.26-1.93 5.93" />
                            </svg>
                            <span>Connect Wallet</span>
                        </button>
                    }
                    {
                        user &&
                        <button className="bg-cyan-400 text-black px-4 py-2 rounded-xl font-bold hover:bg-cyan-700 transition flex items-center space-x-2 cursor-pointer ">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M12 11c0 2.21-1.79 4-4 4H5v3h3c3.31 0 6-2.69 6-6 0-.34-.03-.67-.08-1H12z" />
                                <path d="M17.66 5.93l-1.41 1.41a4.01 4.01 0 010 5.66l1.41 1.41a6.007 6.007 0 000-8.48z" />
                                <path d="M19.07 4.5A9.969 9.969 0 0121 12c0 2.21-.72 4.26-1.93 5.93" />
                            </svg>
                            <span>{`${user.slice(0, 3)}...${user.slice(-4)}`}</span>
                        </button>
                    }
                </div>
            </nav>
        </header>
 
    )
}

export default Navbar
