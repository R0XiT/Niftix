// Importing necessary tools
const chai = require("chai");
const { ethers } = require("hardhat");
const { solidity } = require("ethereum-waffle");

chai.use(solidity);
const { expect } = chai;

// Constants
const NAME = "TokenMaster";
const SYMBOL = "TM";

const OCCASION_NAME = "ETH Simrol";
const OCCASION_COST = ethers.utils.parseUnits("1", "ether");
const OCCASION_MAX_TICKETS = 100;
const OCCASION_DATE = "Apr 27";
const OCCASION_TIME = "10:00AM CST";
const OCCASION_LOCATION = "MP, Simrol";
const OCCASION_DESCRIPTION = "By team Chicken";

describe("TokenMaster", function () {
  let tokenMaster;
  let deployer, buyer, buyer2, buyer3, buyer4;

  beforeEach(async function () {
    [deployer, buyer, buyer2, buyer3, buyer4] = await ethers.getSigners();

    const TokenMaster = await ethers.getContractFactory("TokenMaster");
    tokenMaster = await TokenMaster.deploy(NAME, SYMBOL);
    await tokenMaster.deployed();

    const tx = await tokenMaster
      .connect(deployer)
      .list(
        OCCASION_NAME,
        OCCASION_COST,
        OCCASION_MAX_TICKETS,
        OCCASION_DATE,
        OCCASION_TIME,
        OCCASION_LOCATION,
        OCCASION_DESCRIPTION
      );
    await tx.wait();
  });

  describe("Deployment", function () {
    it("Should set the name and symbol correctly", async function () {
      expect(await tokenMaster.name()).to.equal(NAME);
      expect(await tokenMaster.symbol()).to.equal(SYMBOL);
    });
  });

  describe("Listing Occasion", function () {
    it("Should create an occasion", async function () {
      const occasion = await tokenMaster.getOccasion(deployer.address, 0);
      expect(occasion.name).to.equal(OCCASION_NAME);
      expect(occasion.cost.toString()).to.equal(OCCASION_COST.toString());
    });
  });

  describe("Creating Tickets", function () {
    it("Should create a ticket", async function () {
      await tokenMaster
        .connect(buyer)
        .createTicket(deployer.address, 0, 1, buyer.address, { value: OCCASION_COST });

      expect(await tokenMaster.totalSupply()).to.equal(1n);
      expect(await tokenMaster.ownerOf(1)).to.equal(buyer.address);
    });

    it("Should fail if seat is already taken", async function () {
      await tokenMaster
        .connect(buyer)
        .createTicket(deployer.address, 0, 2, buyer.address, { value: OCCASION_COST });

      await expect(
        tokenMaster
          .connect(buyer2)
          .createTicket(deployer.address, 0, 2, buyer2.address, { value: OCCASION_COST })
      ).to.be.revertedWith("Seat already taken");
    });
  });

  describe("Cancel Ticket", function () {
    it("Should cancel ticket and refund", async function () {
      const seatId = 3;
      await tokenMaster
        .connect(buyer)
        .createTicket(deployer.address, 0, seatId, buyer.address, { value: OCCASION_COST });

      const ticketId = 1;
      const occasion = await tokenMaster.getOccasion(deployer.address, 0);

      const buyerBalanceBefore = await ethers.provider.getBalance(buyer.address);

      const tx = await tokenMaster
        .connect(buyer)
        .cancelTicket(deployer.address, ticketId, buyer.address, occasion);
      const receipt = await tx.wait();

      const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);
      const buyerBalanceAfter = await ethers.provider.getBalance(buyer.address);

      const refunded = buyerBalanceAfter.sub(buyerBalanceBefore).add(gasUsed);

      expect(refunded).to.be.closeTo(
        OCCASION_COST.mul(90).div(100),
        ethers.utils.parseUnits("0.01", "ether")
      );
    });
  });

  describe("Secondary Sales", function () {
    beforeEach(async function () {
      await tokenMaster
        .connect(buyer)
        .createTicket(deployer.address, 0, 4, buyer.address, { value: OCCASION_COST });
    });

    it("Should allow ticket listing and buying", async function () {
      const ticketId = 1;
      const resalePrice = ethers.utils.parseUnits("1.5", "ether");

      await tokenMaster.connect(buyer).sellTicket(ticketId, resalePrice);

      await expect(() =>
        tokenMaster.connect(buyer2).buyTicket(ticketId, {
          value: resalePrice,
        })
      ).to.changeEtherBalances(
        [buyer, buyer2],
        [resalePrice, resalePrice.mul(-1)]
      );

      expect(await tokenMaster.ownerOf(ticketId)).to.equal(buyer2.address);
    });

    it("Should fail if not enough ETH is sent", async function () {
      const ticketId = 1;
      const resalePrice = ethers.utils.parseUnits("1.5", "ether");

      await tokenMaster.connect(buyer).sellTicket(ticketId, resalePrice);

      await expect(
        tokenMaster.connect(buyer2).buyTicket(ticketId, {
          value: ethers.utils.parseUnits("1", "ether"),
        })
      ).to.be.revertedWith("Insufficient payment");
    });
  });

  describe("Withdraw", function () {
    it("Should allow withdraw of funds", async function () {
      const amount = ethers.utils.parseUnits("0.1", "ether");

      await deployer.sendTransaction({
        to: tokenMaster.address,
        value: ethers.utils.parseUnits("0.2", "ether"),
      });

      const contractBalanceBefore = await ethers.provider.getBalance(tokenMaster.address);
      const deployerBalanceBefore = await ethers.provider.getBalance(deployer.address);

      const tx = await tokenMaster.connect(deployer).withdraw(deployer.address, amount);
      const receipt = await tx.wait();

      const gasUsed = receipt.gasUsed;
      const gasPrice = receipt.effectiveGasPrice;
      const gasCost = gasUsed.mul(gasPrice);

      const contractBalanceAfter = await ethers.provider.getBalance(tokenMaster.address);
      const deployerBalanceAfter = await ethers.provider.getBalance(deployer.address);

      expect(contractBalanceBefore.sub(contractBalanceAfter)).to.equal(amount);
      expect(deployerBalanceAfter.sub(deployerBalanceBefore)).to.be.closeTo(
        amount.sub(gasCost),
        ethers.utils.parseUnits("0.01", "ether")
      );
    });

    it("Should allow deployer to withdraw only their occasion's funds", async function () {
      const amount = ethers.utils.parseEther("1");
      const deployerOccasionID = 0;
      const buyerOccasionID = 0;

      await tokenMaster.connect(deployer).list(
        "Deployer Event",
        amount,
        10,
        "2024-04-26",
        "18:00",
        "Delhi",
        "Deployer's show"
      );

      await tokenMaster.connect(buyer).list(
        "Buyer Event",
        amount,
        10,
        "2024-04-26",
        "20:00",
        "Mumbai",
        "Buyer's show"
      );

      const buyers = [buyer2, buyer3, buyer4];

      for (let i = 0; i < buyers.length; i++) {
        await tokenMaster
          .connect(buyers[i])
          .createTicket(deployer.address, deployerOccasionID, i, buyers[i].address, {
            value: amount,
          });

        await tokenMaster
          .connect(buyers[i])
          .createTicket(buyer.address, buyerOccasionID, i, buyers[i].address, {
            value: amount,
          });

        await tokenMaster
          .connect(buyers[i])
          .createTicket(buyer.address, buyerOccasionID, i + 3, buyers[i].address, {
            value: amount,
          });
      }

      const contractBalanceBefore = await ethers.provider.getBalance(tokenMaster.address);
      const deployerBalanceBefore = await ethers.provider.getBalance(deployer.address);

      const tx = await tokenMaster
        .connect(deployer)
        .withdraw(deployer.address, amount.mul(3));
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);

      const contractBalanceAfter = await ethers.provider.getBalance(tokenMaster.address);
      const deployerBalanceAfter = await ethers.provider.getBalance(deployer.address);

      expect(contractBalanceAfter).to.equal(amount.mul(6));
      expect(deployerBalanceAfter.sub(deployerBalanceBefore)).to.be.closeTo(
        amount.mul(3).sub(gasUsed),
        ethers.utils.parseEther("0.01")
      );
    });
  });
});
