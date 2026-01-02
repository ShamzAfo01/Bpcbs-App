// ForgeOS Web3 Security Types

export enum NetworkId {
    POLYGON = 137,
    SOLANA = 101, // Placeholder
    BASE = 8453
}

export enum SecurityLevel {
    NONE = 'NONE',
    CAPTCHA_PASSED = 'CAPTCHA_PASSED',
    GITCOIN_PASSED = 'GITCOIN_PASSED',
    LEVEL_1_NFT = 'LEVEL_1_NFT'
}

export interface UserProfile {
    walletAddress: string;
    networkId: NetworkId;
    securityLevel: SecurityLevel;
    points: number;
    lastActive: number; // Server Timestamp
    isFlagged: boolean; // Sybil/Bot flag
}

export interface GameSession {
    id: string; // UUID
    questId: number;
    startTime: number; // NTP Timestamp
    nonce: string; // Random server secret
    isValid: boolean;
}

export interface ScoreSubmission {
    sessionId: string;
    score: number;
    clientTimestamp: number;
    signature: string; // Signed by wallet: Hash(sessionId + score + timestamp)
}

export interface ClaimRequest {
    walletAddress: string;
    amount: number;
    signature: string;
    gasStrategy: 'NATIVE' | 'META_TX' | 'DEDUCT_REWARDS';
}

export interface TransactionStatus {
    hash: string;
    status: 'PENDING' | 'SUCCESS' | 'DROPPED' | 'FAILED';
    confirmations: number;
}
