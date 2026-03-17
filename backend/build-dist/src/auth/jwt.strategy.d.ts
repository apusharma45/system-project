import { Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
type JwtPayload = {
    sub: string;
    email: string;
    role: string;
};
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly usersService;
    constructor(usersService: UsersService);
    validate(payload: JwtPayload): Promise<{
        userId: string;
        email: string;
        role: string;
        fullName: string | null;
        avatarUrl: string | null;
    }>;
}
export {};
