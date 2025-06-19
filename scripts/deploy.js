const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
};

async function main() {
  const [deployer] = await ethers.getSigners();
  const NAME = "TokenMaster";
  const SYMBOL = "TM";

  console.log(`Deploying TokenMaster contract with the account: ${deployer.address}`);

  const TokenMaster = await ethers.getContractFactory("TokenMaster");
  const tokenMaster = await TokenMaster.deploy(NAME, SYMBOL);
  await tokenMaster.deployed();

  console.log(`✅ Deployed TokenMaster Contract at: ${tokenMaster.address}\n`);

  const occasions = [
    { 
      name: "UFC Miami",
      cost: tokens(3),
      maxTickets: 200,
      date: "May 31",
      time: "6:00PM EST",
      location: "Miami-Dade Arena - Miami, FL",
      description: "Watch UFC live in Miami!"
    },
    {
      name: "ETH Tokyo",
      cost: tokens(1),
      maxTickets: 200,
      date: "Jun 2",
      time: "1:00PM JST",
      location: "Tokyo, Japan",
      description: "Biggest Ethereum hackathon in Asia."
    },
    {
      name: "ETH Privacy Hackathon",
      cost: tokens(0.25),
      maxTickets: 200,
      date: "Jun 9",
      time: "10:00AM TRT",
      location: "Turkey, Istanbul",
      description: "Hackathon focused on privacy innovations."
    },
    {
      name: "Dallas Mavericks vs. San Antonio Spurs",
      cost: tokens(5),
      maxTickets: 200,
      date: "Jun 11",
      time: "2:30PM CST",
      location: "American Airlines Center - Dallas, TX",
      description: "NBA Match in Dallas!"
    },
    {
      name: "ETH Global Toronto",
      cost: tokens(1.5),
      maxTickets: 200,
      date: "Jun 23",
      time: "11:00AM EST",
      location: "Toronto, Canada",
      description: "Ethereum builders gathering in Toronto."
    }
  ];

  for (let i = 0; i < occasions.length; i++) {
    const tx = await tokenMaster.connect(deployer).list(
      occasions[i].name,
      occasions[i].cost,
      occasions[i].maxTickets,
      occasions[i].date,
      occasions[i].time,
      occasions[i].location,
      occasions[i].description
    );

    await tx.wait();
    console.log(`🎟️ Listed Event ${i + 1}: ${occasions[i].name}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
