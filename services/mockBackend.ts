 Wikipedia Wikipediaimport { UserProfile, NetworkId, SecurityLevel, GameSession, ScoreSubmission, ClaimRequest, TransactionStatus } from '../types/web3';

// Mock Backend Service
// In production, this would be a Node.js/Python API

class MockBackendService {
    private users: Map<string, UserProfile> = new Map();
    private sessions: Map<string, GameSession> = new Map();
    private SERVER_TIME_OFFSET = 0; // Simulate server time diff

    // Phase 1: Authentication & Identity
    async login(walletAddress: string, networkId: NetworkId): Promise<{ user: UserProfile, token: string }> {
        console.log(`[Backend] Login request: ${walletAddress} on Chain ${networkId}`);

        // Simulate Network Check
        if (networkId !== NetworkId.POLYGON) {
            throw new Error("WRONG_NETWORK: Please switch to Polygon.");
        }

        // Simulate Sybil Check (Randomly flag for Captcha if new)
        let user = this.users.get(walletAddress);
        if (!user) {
            // New User - Check Bot Score
            const isSybil = Math.random() > 0.9; // 10% chance of being a bot
            if (isSybil) {
                throw new Error("SYBIL_DETECTED: Please complete Proof of Humanity.");
            }

            user = {
                walletAddress,
                networkId,
                securityLevel: SecurityLevel.NONE, // Requires Upgrade
                points: 0,
                lastActive: Date.now(),
                isFlagged: false
            };
            this.users.set(walletAddress, user);
        }

        return { user, token: "jwt_mock_" + Date.now() };
    }

    // Phase 2: The Earning Loop
    async startSession(walletAddress: string, questId: number): Promise<GameSession> {
        // Edge Case: Cooldown Check
        const user = this.users.get(walletAddress);
        if (!user) throw new Error("UNAUTHORIZED");

        // Mock NTP Check
        if (Math.abs(Date.now() - user.lastActive) < 1000) {
            // Spam prevention
        }

        const session: GameSession = {
            id: crypto.randomUUID(),
            questId,
            startTime: Date.now() + this.SERVER_TIME_OFFSET,
            nonce: crypto.randomUUID(),
            isValid: true
        };
        this.sessions.set(session.id, session);
        console.log(`[Backend] Session Started: ${session.id}`);
        return session;
    }

    async submitScore(submission: ScoreSubmission): Promise<{ success: boolean, newBalance: number }> {
        const session = this.sessions.get(submission.sessionId);
        if (!session || !session.isValid) throw new Error("INVALID_SESSION");

        // Edge Case: Time Tampering
        const duration = submission.clientTimestamp - session.startTime;
        if (duration < 2000) { // Impossible to solve in < 2s
            throw new Error("SPEED_HACK_DETECTED");
        }

        // Logic: Verify Signature (Mock)
        // const set = verify(submission.signature, ...);

        // Soft Credit
        const user = Array.from(this.users.values()).find(u => true); // Mock lookup
        if (user) {
            user.points += submission.score;
            this.sessions.delete(submission.sessionId); // One-time use
            return { success: true, newBalance: user.points };
        }
        return { success: false, newBalance: 0 };
    }

    // Phase 3: Claim Flow
    async claimRewards(request: ClaimRequest): Promise<TransactionStatus> {
        console.log(`[Backend] Claim Initiated: ${request.amount} by ${request.walletAddress}`);

        // Edge Case: Threshold
        if (request.amount < 100) {
            throw new Error("BELOW_THRESHOLD: Minimum 100 Points.");
        }

        // Edge Case: Gas Strategy
        if (request.gasStrategy === 'DEDUCT_REWARDS') {
            // Deduct fee
        }

        // Simulate Blockchain Tx
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    hash: "0x" + Math.random().toString(16).slice(2),
                    status: 'SUCCESS',
                    confirmations: 1
                });
            }, 3000);
        });
    }
}

export const Backend = new MockBackendService();
