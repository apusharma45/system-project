import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    checkApp(): {
        status: "ok";
    };
    checkDb(): Promise<{
        status: "ok";
    }>;
}
