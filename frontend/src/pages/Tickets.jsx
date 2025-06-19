import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { JsonRpcProvider, Wallet, Contract, } from "ethers";
import abi from "../../../abi.js";


// Define your contract's ABI and address here
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";  // Replace with your contract address
const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
;

const TicketsPage = () => {
    const [occasion, setOccasion] = useState(null);
    const [ticketsLeft, setTicketsLeft] = useState(0);  // State for the remaining tickets
    const location = useLocation();
    const [occasionCostInWei, setOccasionCostInWei] = useState(0);

    useEffect(() => {
        // Get the query parameter `occasion` from the URL
        const queryParams = new URLSearchParams(location.search);
        const occasionData = queryParams.get('occasion');
        console.log("Occasion data from URL:", occasionData);

        if (occasionData) {
            // Parse the occasion data from the URL and set it to state
            const parsedOccasion = JSON.parse(decodeURIComponent(occasionData));
            setOccasion(parsedOccasion);

            const initailTickets = parsedOccasion.ticketsSold;
            setTicketsLeft(initailTickets);
            const cost = parseFloat(parsedOccasion.cost) * 1e18; // Convert cost to wei
            setOccasionCostInWei(cost);  // Store the cost in wei for later use
        }
    }, [location.search]);

    // Initialize ethers.js
    const provider = new JsonRpcProvider("http://127.0.0.1:8545");
    const signer = new Wallet(PRIVATE_KEY, provider);
    const contract = new Contract(CONTRACT_ADDRESS, abi, signer);

    // Handle the ticket purchase (decrease tickets count and call smart contract)
    const handleBuyTicket = async () => {
        if (ticketsLeft > 0) {
            try {
                const seat = ticketsLeft-1; // Replace with selected seat logic if needed
                const recipient = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";  

                const cost = occasionCostInWei.toString();  // Convert cost to wei
                const transaction = await contract.createTicket(
                    recipient,  // User's address
                    occasion.id,  // Occasion ID
                    seat,  // Seat ID (implement a logic to select the seat)
                    recipient,  // Recipient's address (again, the user)
                    { value: cost }  // Pass ETH value with the transaction
                );

                console.log("Transaction sent:", transaction);
                await transaction.wait();  // Wait for the transaction to be mined

                // After the transaction is successful, update the tickets left
                setTicketsLeft(ticketsLeft - 1);  // Decrease ticket count
                alert("Ticket successfully purchased!");
            } catch (error) {
                console.error("Error purchasing ticket:", error);
                alert("Failed to purchase ticket.");
            }
        } else {
            alert("Sorry, no tickets available!");
        }
    };

    if (!occasion) return <p>Loading...</p>;

    return (
        <div className="ticket-details max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-4">
    <h1 className="text-2xl font-bold text-gray-800">{occasion.name}</h1>
    
    <p className="text-gray-600"><strong className="text-gray-800">Location:</strong> {occasion.location}</p>
    <p className="text-gray-600"><strong className="text-gray-800">Timings:</strong> {occasion.time}</p>
    <p className="text-gray-600"><strong className="text-gray-800">Description:</strong> {occasion.description}</p>
    <p className="text-gray-600"><strong className="text-gray-800">Price per Ticket:</strong> {occasion.cost} ETH</p>
    <p className="text-gray-600"><strong className="text-gray-800">Tickets Left:</strong> {ticketsLeft}</p>

    <button
        onClick={handleBuyTicket}
        disabled={ticketsLeft <= 0}
        className={`w-full py-2 px-4 rounded-xl text-white font-semibold transition 
            ${ticketsLeft <= 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
    >
        {ticketsLeft <= 0 ? "Sold Out" : "Buy Ticket"}
    </button>
</div>
    );
};

export default TicketsPage;
