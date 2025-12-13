const CONTRACT_ABI = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_backendSigner",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "player",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "score",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint8",
                name: "difficulty",
                type: "uint8",
            },
            {
                indexed: false,
                internalType: "bytes32",
                name: "gameHash",
                type: "bytes32",
            },
        ],
        name: "ScoreSubmitted",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "player",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "score",
                type: "uint256",
            },
            {
                internalType: "uint8",
                name: "difficulty",
                type: "uint8",
            },
            {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "nonce",
                type: "uint256",
            },
            {
                internalType: "bytes32",
                name: "gameHash",
                type: "bytes32",
            },
            {
                internalType: "bytes",
                name: "signature",
                type: "bytes",
            },
        ],
        name: "submitScore",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "backendSigner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "bestScores",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getLeaderboard",
        outputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "player",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "score",
                        type: "uint256",
                    },
                    {
                        internalType: "uint8",
                        name: "difficulty",
                        type: "uint8",
                    },
                    {
                        internalType: "uint256",
                        name: "timestamp",
                        type: "uint256",
                    },
                    {
                        internalType: "bytes32",
                        name: "gameHash",
                        type: "bytes32",
                    },
                ],
                internalType: "struct SnowMotionLeaderboard.Score[]",
                name: "",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getLeaderboardLength",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "leaderboard",
        outputs: [
            {
                internalType: "address",
                name: "player",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "score",
                type: "uint256",
            },
            {
                internalType: "uint8",
                name: "difficulty",
                type: "uint8",
            },
            {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
            },
            {
                internalType: "bytes32",
                name: "gameHash",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        name: "usedGameHashes",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "verifyBackendSigner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];


module.exports = {
    CONTRACT_ABI,
};