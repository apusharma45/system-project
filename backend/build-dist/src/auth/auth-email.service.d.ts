export declare class AuthEmailService {
    private readonly logger;
    sendPasswordResetCode(params: {
        toEmail: string;
        fullName?: string | null;
        code: string;
    }): Promise<void>;
}
