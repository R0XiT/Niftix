import React, { useEffect, useState } from "react";
import { JsonRpcProvider, Wallet, Contract, } from "ethers";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import abi from "../../../abi.js"; // make sure ABI is accessible here

export default function EventsPage() {
    const [occasions, setOccasions] = useState([]);
    const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const hardcodedAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    useEffect(() => {
        const provider = new JsonRpcProvider("http://127.0.0.1:8545");
        const signer = new Wallet(PRIVATE_KEY, provider);
        const contract = new Contract(contractAddress, abi, signer);

        const fetchOccasions = async () => {
            try {
                const data = await contract.getOccasionsOf(hardcodedAddress);
                const formattedData = data.map((occasion) => ({
                    id: occasion[0].toString(),            // Convert BigNumber to string
                    name: occasion[1],
                    // BigNumber handling: we use `.toString()` to avoid issues with BigInt
                    cost: (parseFloat(occasion[2].toString()) / 1e18).toFixed(4),  // Convert the cost from Wei to ETH (divide by 1e18)
                    ticketsSold: occasion[3].toString(),    // Convert BigNumber to string
                    maxTickets: occasion[4].toString(),     // Convert BigNumber to string
                    date: occasion[5],
                    time: occasion[6],
                    location: occasion[7],
                    description: occasion[8],
                    isActive: occasion[9] ? "Yes" : "No",  // Convert boolean to Yes/No
                }));

                setOccasions(formattedData);
                console.log("Fetched occasions:", formattedData);
            } catch (error) {
                console.error("Failed to fetch occasions:", error);
            }
        };


        fetchOccasions();
    }, []);
    useEffect(() => {
        if (occasions.length > 0) {
            console.log("Updated occasions:", occasions[0].id);
        }
    }, [occasions]);


    return (
        <div className="h-screen bg-black flex flex-col gap-3">
            <Navbar />
            <div className="z-11 top-[10%] h-[85%] w-full px-10 py-10 overflow-y-scroll">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                    {occasions.map((occasion) => (
                        <Card key={occasion.id} title={`Event at: ${occasion.location}`} description={occasion.description} 
                            timings={occasion.time} location={occasion.location} occasion={occasion}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
