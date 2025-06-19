
import React, { useState } from "react";
import { JsonRpcProvider, Wallet, Contract } from "ethers";
import Navbar from "../components/Navbar";
import abi from "../../../abi.js"; // make sure ABI is accessible here



const Create = () => {
  const fixedUsers = [
    { id: 1, name: "John Doe", Account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" },
    { id: 2, name: "Jane Smith", Account: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" },
    { id: 3, name: "Alice Johnson", Account: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC" },
    { id: 4, name: "Bob Brown", Account: "0x90F79bf6EB2c4f870365E785982E1f101E93b906" },
    { id: 5, name: "Charlie Davis", Account: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65" },
  ];

  const [selectedUser, setSelectedUser] = useState(fixedUsers[0].Account);  // Default to first user
  const [occasion, setOccasion] = useState({
    name: "",
    cost: "",
    maxTickets: "",
    date: "",
    time: "",
    location: "",
    description: "",
  });

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your contract address

  // Handle form input changes
  const handleChange = (e) => {
    setOccasion({ ...occasion, [e.target.name]: e.target.value });
  };

  // Handle the form submission to create an occasion
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
        const provider = new JsonRpcProvider("http://127.0.0.1:8545");
        const signer = new Wallet(PRIVATE_KEY, provider); 
        const contract = new Contract(contractAddress, abi, signer);
        console.log(occasion.cost); 

      const tx = await contract.list(
        occasion.name,
        occasion.cost,  // Convert cost to Wei
        occasion.maxTickets,
        occasion.date,
        occasion.time,
        occasion.location,
        occasion.description
      );

      // Wait for transaction to be mined
      await tx.wait();
      alert("Occasion created successfully!");
    } catch (error) {
      console.error("Error creating occasion:", error);
      alert("Failed to create occasion.");
    }
  };

  return (
    <div className="bg-black h-screen ">
      <Navbar />
      <div className="absolute top-[15%] left-[3%] flex justify-center items-center h-[80%] w-full overflow-y-scroll ">
      <form
          onSubmit={handleSubmit}
          className="bg-white p-6 m-2 rounded-md shadow-lg max-w-lg w-[80%] h-auto space-y-4"
        >
          <h2 className="text-2xl font-semibold mb-4 text-center">Create an Occasion</h2>

          {/* User Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select User</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="p-2 w-full rounded-md border border-gray-300"
            >
              {fixedUsers.map((user) => (
                <option key={user.id} value={user.Account}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Occasion Fields */}
          <div className="grid grid-cols-1 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Occasion Name</label>
              <input
                type="text"
                name="name"
                value={occasion.name}
                onChange={handleChange}
                required
                className="p-2 w-full rounded-md border border-gray-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cost (Wei)</label>
              <input
                type="text"
                name="cost"
                value={occasion.cost}
                onChange={handleChange}
                required
                className="p-2 w-full rounded-md border border-gray-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Tickets</label>
              <input
                type="number"
                name="maxTickets"
                value={occasion.maxTickets}
                onChange={handleChange}
                required
                className="p-2 w-full rounded-md border border-gray-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="text"
                name="date"
                value={occasion.date}
                onChange={handleChange}
                required
                className="p-2 w-full rounded-md border border-gray-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input
                type="text"
                name="time"
                value={occasion.time}
                onChange={handleChange}
                required
                className="p-2 w-full rounded-md border border-gray-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={occasion.location}
                onChange={handleChange}
                required
                className="p-2 w-full rounded-md border border-gray-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={occasion.description}
                onChange={handleChange}
                required
                className="p-2 w-full rounded-md border border-gray-300"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold hover:bg-blue-600 transition-colors duration-300"
          >
            Create Occasion
          </button>
        </form>
      </div>
    </div>
  );
};

export default Create;
