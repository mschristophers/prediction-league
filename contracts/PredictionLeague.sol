// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/// @title PredictionLeague
/// @notice Stores leagues, user forecasts (0-100%), market outcomes, and league scores.
///         Scoring is calculated off-chain and submitted via updateScore.
contract PredictionLeague is Ownable {
    struct League {
        uint256 id;
        string name;
        address creator;
        bool exists;
    }

    struct Prediction {
        bool exists;
        uint8 forecast;      // 0-100 inclusive
        uint64 timestamp;    // unix seconds
    }

    struct MarketOutcome {
        bool resolved;
        bool outcome;        // true = YES, false = NO
        uint64 resolvedAt;
    }

    uint256 public nextLeagueId = 1;

    // leagueId => League
    mapping(uint256 => League) public leagues;

    // leagueId => marketId => user => Prediction
    mapping(uint256 => mapping(bytes32 => mapping(address => Prediction))) private _predictions;

    // leagueId => user => score (Brier)
    mapping(uint256 => mapping(address => int256)) private _scores;

    // marketId => MarketOutcome
    mapping(bytes32 => MarketOutcome) public marketOutcomes;

    event LeagueCreated(uint256 indexed leagueId, string name, address indexed creator);
    event PredictionSubmitted(
        uint256 indexed leagueId,
        bytes32 indexed marketId,
        address indexed user,
        uint8 forecast
    );
    event MarketOutcomeSet(bytes32 indexed marketId, bool outcome, uint64 resolvedAt);
    event ScoreUpdated(
        uint256 indexed leagueId,
        address indexed user,
        int256 newScore,
        int256 delta
    );

    /// @param initialOwner Address allowed to set outcomes and scores.
    constructor(address initialOwner) Ownable(initialOwner) {}

    /// @notice Create a new league.
    /// @param name Human-readable league name.
    function createLeague(string calldata name) external returns (uint256 leagueId) {
        require(bytes(name).length > 0, "Name required");

        leagueId = nextLeagueId++;
        leagues[leagueId] = League({
            id: leagueId,
            name: name,
            creator: msg.sender,
            exists: true
        });

        emit LeagueCreated(leagueId, name, msg.sender);
    }

    /// @notice Checks if a league exists.
    function leagueExists(uint256 leagueId) public view returns (bool) {
        return leagues[leagueId].exists;
    }

    /// @notice Submit or update a forecast for a market in a league.
    /// @param forecast Prediction percentage [0, 100].
    function submitPrediction(
        uint256 leagueId,
        bytes32 marketId,
        uint8 forecast
    ) external {
        require(leagueExists(leagueId), "League not found");
        require(forecast <= 100, "Forecast out of range");
        require(marketId != bytes32(0), "Empty marketId");

        Prediction storage p = _predictions[leagueId][marketId][msg.sender];
        p.exists = true;
        p.forecast = forecast;
        p.timestamp = uint64(block.timestamp);

        emit PredictionSubmitted(leagueId, marketId, msg.sender, forecast);
    }

    /// @notice Retrieve a user's prediction.
    function getPrediction(
        uint256 leagueId,
        bytes32 marketId,
        address user
    )
        external
        view
        returns (bool exists, uint8 forecast, uint64 timestamp)
    {
        Prediction storage p = _predictions[leagueId][marketId][user];
        return (p.exists, p.forecast, p.timestamp);
    }

    /// @notice Set the resolved outcome for a market.
    /// @dev Only callable by owner.
    function setMarketOutcome(bytes32 marketId, bool outcome) external onlyOwner {
        require(marketId != bytes32(0), "Empty marketId");

        MarketOutcome storage m = marketOutcomes[marketId];
        m.resolved = true;
        m.outcome = outcome;
        m.resolvedAt = uint64(block.timestamp);

        emit MarketOutcomeSet(marketId, outcome, m.resolvedAt);
    }

    /// @notice Update a user's score in a league.
    /// @dev Only callable by owner; logic computed off-chain.
    function updateScore(
        uint256 leagueId,
        address user,
        int256 scoreDelta
    ) external onlyOwner {
        require(leagueExists(leagueId), "League not found");
        require(user != address(0), "Zero address");

        int256 newScore = _scores[leagueId][user] + scoreDelta;
        _scores[leagueId][user] = newScore;

        emit ScoreUpdated(leagueId, user, newScore, scoreDelta);
    }

    /// @notice Get a user's current score.
    function getScore(uint256 leagueId, address user) external view returns (int256) {
        return _scores[leagueId][user];
    }
}
