import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { ContractTransactionReceipt, EventLog } from "ethers";

describe("PredictionLeague", function () {
  async function deployFixture() {
    const [owner, user1, user2] = await hre.ethers.getSigners();

    const PredictionLeague = await hre.ethers.getContractFactory("PredictionLeague");
    const contract = await PredictionLeague.deploy(owner.address);

    return { contract, owner, user1, user2 };
  }

  function getLeagueIdFromReceipt(receipt: ContractTransactionReceipt | null): bigint {
    if (!receipt) return 1n;
    const event = receipt.logs.find(
      (log): log is EventLog => "fragment" in log && log.fragment?.name === "LeagueCreated"
    ) as EventLog | undefined;
    return event?.args?.leagueId ?? 1n;
  }

  describe("Deployment", function () {
    it("sets the correct owner", async function () {
      const { contract, owner } = await loadFixture(deployFixture);
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("starts nextLeagueId at 1", async function () {
      const { contract } = await loadFixture(deployFixture);
      const nextId = await contract.nextLeagueId();
      expect(nextId).to.equal(1n); // BigInt in ethers v6
    });
  });

  describe("Leagues", function () {
    it("creates a league and marks it as existing", async function () {
      const { contract, owner } = await loadFixture(deployFixture);

      const tx = await contract.createLeague("Test League");
      const receipt = await tx.wait();
      const leagueId = getLeagueIdFromReceipt(receipt);

      const league = await contract.leagues(leagueId);
      expect(league.id).to.equal(leagueId);
      expect(league.name).to.equal("Test League");
      expect(league.creator).to.equal(owner.address);
      expect(league.exists).to.equal(true);

      expect(await contract.leagueExists(leagueId)).to.equal(true);
    });

    it("reverts on empty league name", async function () {
      const { contract } = await loadFixture(deployFixture);

      await expect(contract.createLeague("")).to.be.revertedWith("Name required");
    });

    it("increments league ID correctly for multiple leagues", async function () {
      const { contract } = await loadFixture(deployFixture);

      const tx1 = await contract.createLeague("League 1");
      const receipt1 = await tx1.wait();
      const leagueId1 = getLeagueIdFromReceipt(receipt1);

      const tx2 = await contract.createLeague("League 2");
      const receipt2 = await tx2.wait();
      const leagueId2 = getLeagueIdFromReceipt(receipt2);

      expect(leagueId2).to.equal(leagueId1 + 1n);
      expect(await contract.nextLeagueId()).to.equal(leagueId2 + 1n);
    });

    it("allows different users to create leagues", async function () {
      const { contract, owner, user1 } = await loadFixture(deployFixture);

      const tx1 = await contract.connect(owner).createLeague("Owner League");
      await tx1.wait();

      const tx2 = await contract.connect(user1).createLeague("User League");
      const receipt2 = await tx2.wait();
      const leagueId2 = getLeagueIdFromReceipt(receipt2);

      const league = await contract.leagues(leagueId2);
      expect(league.creator).to.equal(user1.address);
    });
  });

  describe("Predictions", function () {
    it("reverts if league does not exist", async function () {
      const { contract, user1 } = await loadFixture(deployFixture);

      const fakeLeagueId = 999n;
      const marketId = hre.ethers.encodeBytes32String("MARKET-1");

      await expect(
        contract.connect(user1).submitPrediction(fakeLeagueId, marketId, 50)
      ).to.be.revertedWith("League not found");
    });

    it("reverts if forecast > 100", async function () {
      const { contract, user1 } = await loadFixture(deployFixture);

      const tx = await contract.createLeague("League");
      const receipt = await tx.wait();
      const leagueId = getLeagueIdFromReceipt(receipt);

      const marketId = hre.ethers.encodeBytes32String("MARKET-1");

      await expect(
        contract.connect(user1).submitPrediction(leagueId, marketId, 101)
      ).to.be.revertedWith("Forecast out of range");
    });

    it("reverts if marketId is empty", async function () {
      const { contract, user1 } = await loadFixture(deployFixture);

      const tx = await contract.createLeague("League");
      const receipt = await tx.wait();
      const leagueId = getLeagueIdFromReceipt(receipt);

      const emptyMarketId = hre.ethers.ZeroHash; // bytes32(0)

      await expect(
        contract.connect(user1).submitPrediction(leagueId, emptyMarketId, 50)
      ).to.be.revertedWith("Empty marketId");
    });

    it("stores and returns a prediction", async function () {
      const { contract, user1 } = await loadFixture(deployFixture);

      const tx = await contract.createLeague("League");
      const receipt = await tx.wait();
      const leagueId = getLeagueIdFromReceipt(receipt);

      const marketId = hre.ethers.encodeBytes32String("MARKET-1");

      const before = await hre.ethers.provider.getBlock("latest");

      await expect(
        contract.connect(user1).submitPrediction(leagueId, marketId, 80)
      )
        .to.emit(contract, "PredictionSubmitted")
        .withArgs(leagueId, marketId, user1.address, 80);

      const [exists, forecast, timestamp] = await contract.getPrediction(
        leagueId,
        marketId,
        user1.address
      );

      expect(exists).to.equal(true);
      expect(forecast).to.equal(80);
      expect(timestamp).to.be.greaterThanOrEqual(before!.timestamp);
    });

    it("allows updating an existing prediction", async function () {
      const { contract, user1 } = await loadFixture(deployFixture);

      const tx = await contract.createLeague("League");
      const receipt = await tx.wait();
      const leagueId = getLeagueIdFromReceipt(receipt);

      const marketId = hre.ethers.encodeBytes32String("MARKET-1");

      await contract.connect(user1).submitPrediction(leagueId, marketId, 60);
      await contract.connect(user1).submitPrediction(leagueId, marketId, 90);

      const [, forecast] = await contract.getPrediction(
        leagueId,
        marketId,
        user1.address
      );

      expect(forecast).to.equal(90);
    });

    it("accepts boundary values (0 and 100)", async function () {
      const { contract, user1 } = await loadFixture(deployFixture);

      const tx = await contract.createLeague("League");
      const receipt = await tx.wait();
      const leagueId = getLeagueIdFromReceipt(receipt);

      const marketId1 = hre.ethers.encodeBytes32String("MARKET-1");
      const marketId2 = hre.ethers.encodeBytes32String("MARKET-2");

      await contract.connect(user1).submitPrediction(leagueId, marketId1, 0);
      await contract.connect(user1).submitPrediction(leagueId, marketId2, 100);

      const [, forecast1] = await contract.getPrediction(leagueId, marketId1, user1.address);
      const [, forecast2] = await contract.getPrediction(leagueId, marketId2, user1.address);

      expect(forecast1).to.equal(0);
      expect(forecast2).to.equal(100);
    });

    it("allows multiple users to predict on same market", async function () {
      const { contract, user1, user2 } = await loadFixture(deployFixture);

      const tx = await contract.createLeague("League");
      const receipt = await tx.wait();
      const leagueId = getLeagueIdFromReceipt(receipt);

      const marketId = hre.ethers.encodeBytes32String("MARKET-1");

      await contract.connect(user1).submitPrediction(leagueId, marketId, 30);
      await contract.connect(user2).submitPrediction(leagueId, marketId, 70);

      const [, forecast1] = await contract.getPrediction(leagueId, marketId, user1.address);
      const [, forecast2] = await contract.getPrediction(leagueId, marketId, user2.address);

      expect(forecast1).to.equal(30);
      expect(forecast2).to.equal(70);
    });

    it("returns non-existent prediction correctly", async function () {
      const { contract, user1 } = await loadFixture(deployFixture);

      const tx = await contract.createLeague("League");
      const receipt = await tx.wait();
      const leagueId = getLeagueIdFromReceipt(receipt);

      const marketId = hre.ethers.encodeBytes32String("MARKET-1");

      const [exists, forecast, timestamp] = await contract.getPrediction(
        leagueId,
        marketId,
        user1.address
      );

      expect(exists).to.equal(false);
      expect(forecast).to.equal(0);
      expect(timestamp).to.equal(0);
    });
  });

  describe("Market outcomes", function () {
    it("only owner can set market outcome", async function () {
      const { contract, owner, user1 } = await loadFixture(deployFixture);
      const marketId = hre.ethers.encodeBytes32String("MARKET-1");

      await expect(
        contract.connect(user1).setMarketOutcome(marketId, true)
      ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount");

      const tx = await contract.connect(owner).setMarketOutcome(marketId, true);
      await tx.wait();

      const outcome = await contract.marketOutcomes(marketId);
      expect(outcome.resolved).to.equal(true);
      expect(outcome.outcome).to.equal(true);
      expect(outcome.resolvedAt).to.be.greaterThan(0);
    });

    it("reverts if marketId is empty", async function () {
      const { contract, owner } = await loadFixture(deployFixture);
      const emptyMarketId = hre.ethers.ZeroHash;

      await expect(
        contract.connect(owner).setMarketOutcome(emptyMarketId, true)
      ).to.be.revertedWith("Empty marketId");
    });

    it("emits MarketOutcomeSet event with correct parameters", async function () {
      const { contract, owner } = await loadFixture(deployFixture);
      const marketId = hre.ethers.encodeBytes32String("MARKET-1");

      await expect(contract.connect(owner).setMarketOutcome(marketId, false))
        .to.emit(contract, "MarketOutcomeSet")
        .withArgs(marketId, false, (timestamp: bigint) => timestamp > 0n);
    });

    it("allows setting outcome for same market multiple times", async function () {
      const { contract, owner } = await loadFixture(deployFixture);
      const marketId = hre.ethers.encodeBytes32String("MARKET-1");

      await contract.connect(owner).setMarketOutcome(marketId, true);
      await contract.connect(owner).setMarketOutcome(marketId, false);

      const outcome = await contract.marketOutcomes(marketId);
      expect(outcome.outcome).to.equal(false);
    });
  });

  describe("Scores", function () {
    it("only owner can update score", async function () {
      const { contract, owner, user1, user2 } = await loadFixture(deployFixture);

      const tx = await contract.createLeague("League");
      const receipt = await tx.wait();
      const leagueId = getLeagueIdFromReceipt(receipt);

      await expect(
        contract.connect(user2).updateScore(leagueId, user1.address, 10)
      ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount");

      await expect(
        contract.connect(owner).updateScore(leagueId, user1.address, 10)
      )
        .to.emit(contract, "ScoreUpdated")
        .withArgs(leagueId, user1.address, 10, 10);

      const score = await contract.getScore(leagueId, user1.address);
      expect(score).to.equal(10);
    });

    it("accumulates score deltas correctly", async function () {
      const { contract, owner, user1 } = await loadFixture(deployFixture);

      const tx = await contract.createLeague("League");
      const receipt = await tx.wait();
      const leagueId = getLeagueIdFromReceipt(receipt);

      await contract.connect(owner).updateScore(leagueId, user1.address, 5);
      await contract.connect(owner).updateScore(leagueId, user1.address, -2);

      const score = await contract.getScore(leagueId, user1.address);
      expect(score).to.equal(3);
    });

    it("reverts when updating score for zero address", async function () {
      const { contract, owner } = await loadFixture(deployFixture);

      const tx = await contract.createLeague("League");
      const receipt = await tx.wait();
      const leagueId = getLeagueIdFromReceipt(receipt);

      await expect(
        contract.connect(owner).updateScore(leagueId, hre.ethers.ZeroAddress, 10)
      ).to.be.revertedWith("Zero address");
    });

    it("reverts when updating score for non-existent league", async function () {
      const { contract, owner, user1 } = await loadFixture(deployFixture);
      const fakeLeagueId = 999n;

      await expect(
        contract.connect(owner).updateScore(fakeLeagueId, user1.address, 10)
      ).to.be.revertedWith("League not found");
    });

    it("handles negative score deltas correctly", async function () {
      const { contract, owner, user1 } = await loadFixture(deployFixture);

      const tx = await contract.createLeague("League");
      const receipt = await tx.wait();
      const leagueId = getLeagueIdFromReceipt(receipt);

      await contract.connect(owner).updateScore(leagueId, user1.address, -10);

      const score = await contract.getScore(leagueId, user1.address);
      expect(score).to.equal(-10);
    });

    it("maintains separate scores per league", async function () {
      const { contract, owner, user1 } = await loadFixture(deployFixture);

      const tx1 = await contract.createLeague("League 1");
      const receipt1 = await tx1.wait();
      const leagueId1 = getLeagueIdFromReceipt(receipt1);

      const tx2 = await contract.createLeague("League 2");
      const receipt2 = await tx2.wait();
      const leagueId2 = getLeagueIdFromReceipt(receipt2);

      await contract.connect(owner).updateScore(leagueId1, user1.address, 100);
      await contract.connect(owner).updateScore(leagueId2, user1.address, 200);

      const score1 = await contract.getScore(leagueId1, user1.address);
      const score2 = await contract.getScore(leagueId2, user1.address);

      expect(score1).to.equal(100);
      expect(score2).to.equal(200);
    });

    it("returns zero for users with no score", async function () {
      const { contract, user1 } = await loadFixture(deployFixture);

      const tx = await contract.createLeague("League");
      const receipt = await tx.wait();
      const leagueId = getLeagueIdFromReceipt(receipt);

      const score = await contract.getScore(leagueId, user1.address);
      expect(score).to.equal(0);
    });
  });

  describe("Integration scenarios", function () {
    it("complete workflow: create league, submit predictions, resolve market, update scores", async function () {
      const { contract, owner, user1, user2 } = await loadFixture(deployFixture);

      // Create league
      const tx = await contract.createLeague("Test League");
      const receipt = await tx.wait();
      const leagueId = getLeagueIdFromReceipt(receipt);

      // Submit predictions
      const marketId = hre.ethers.encodeBytes32String("MARKET-1");
      await contract.connect(user1).submitPrediction(leagueId, marketId, 75);
      await contract.connect(user2).submitPrediction(leagueId, marketId, 25);

      // Resolve market
      await contract.connect(owner).setMarketOutcome(marketId, true);

      // Update scores (simulating Brier score calculation)
      await contract.connect(owner).updateScore(leagueId, user1.address, -625); // Better prediction
      await contract.connect(owner).updateScore(leagueId, user2.address, -5625); // Worse prediction

      // Verify final state
      const outcome = await contract.marketOutcomes(marketId);
      expect(outcome.resolved).to.equal(true);
      expect(outcome.outcome).to.equal(true);

      const score1 = await contract.getScore(leagueId, user1.address);
      const score2 = await contract.getScore(leagueId, user2.address);
      expect(score1).to.equal(-625);
      expect(score2).to.equal(-5625);
    });

    it("handles multiple markets in same league", async function () {
      const { contract, owner, user1 } = await loadFixture(deployFixture);

      const tx = await contract.createLeague("Multi-Market League");
      const receipt = await tx.wait();
      const leagueId = getLeagueIdFromReceipt(receipt);

      const marketId1 = hre.ethers.encodeBytes32String("MARKET-1");
      const marketId2 = hre.ethers.encodeBytes32String("MARKET-2");
      const marketId3 = hre.ethers.encodeBytes32String("MARKET-3");

      await contract.connect(user1).submitPrediction(leagueId, marketId1, 50);
      await contract.connect(user1).submitPrediction(leagueId, marketId2, 75);
      await contract.connect(user1).submitPrediction(leagueId, marketId3, 25);

      await contract.connect(owner).setMarketOutcome(marketId1, true);
      await contract.connect(owner).setMarketOutcome(marketId2, false);
      await contract.connect(owner).setMarketOutcome(marketId3, true);

      // Accumulate scores across multiple markets
      await contract.connect(owner).updateScore(leagueId, user1.address, -2500);
      await contract.connect(owner).updateScore(leagueId, user1.address, -5625);
      await contract.connect(owner).updateScore(leagueId, user1.address, -5625);

      const finalScore = await contract.getScore(leagueId, user1.address);
      expect(finalScore).to.equal(-13750);
    });
  });
});
