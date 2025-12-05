export const predictionLeagueAbi = [
    {
      "inputs": [{ "internalType": "address", "name": "initialOwner", "type": "address" }],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "nextLeagueId",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "name": "leagues",
      "outputs": [
        { "internalType": "uint256", "name": "id", "type": "uint256" },
        { "internalType": "string", "name": "name", "type": "string" },
        { "internalType": "address", "name": "creator", "type": "address" },
        { "internalType": "bool", "name": "exists", "type": "bool" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "string", "name": "name", "type": "string" }],
      "name": "createLeague",
      "outputs": [{ "internalType": "uint256", "name": "leagueId", "type": "uint256" }],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "leagueId", "type": "uint256" },
        { "internalType": "bytes32", "name": "marketId", "type": "bytes32" },
        { "internalType": "uint8", "name": "forecast", "type": "uint8" }
      ],
      "name": "submitPrediction",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "leagueId", "type": "uint256" },
        { "internalType": "bytes32", "name": "marketId", "type": "bytes32" },
        { "internalType": "address", "name": "user", "type": "address" }
      ],
      "name": "getPrediction",
      "outputs": [
        { "internalType": "bool", "name": "exists", "type": "bool" },
        { "internalType": "uint8", "name": "forecast", "type": "uint8" },
        { "internalType": "uint64", "name": "timestamp", "type": "uint64" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "leagueId", "type": "uint256" },
        { "internalType": "address", "name": "user", "type": "address" }
      ],
      "name": "getScore",
      "outputs": [{ "internalType": "int256", "name": "", "type": "int256" }],
      "stateMutability": "view",
      "type": "function"
    }
  ] as const;
  