import { Role } from '../../generated/prisma/client';
import { CreateLabOrderDto } from './dto/create-lab-order.dto';
import { UploadLabResultDto } from './dto/upload-lab-result.dto';
import { LabsService } from './labs.service';
type RequestUser = {
    userId: string;
    role: Role;
};
export declare class LabsController {
    private readonly labsService;
    constructor(labsService: LabsService);
    createOrder(req: {
        user: RequestUser;
    }, dto: CreateLabOrderDto): Promise<any>;
    assign(req: {
        user: RequestUser;
    }, id: string): Promise<any>;
    sampleCollected(req: {
        user: RequestUser;
    }, id: string): Promise<any>;
    resultUploaded(req: {
        user: RequestUser;
    }, id: string, dto: UploadLabResultDto): Promise<any>;
    sent(req: {
        user: RequestUser;
    }, id: string): Promise<any>;
    listMine(req: {
        user: RequestUser;
    }): any;
    getResult(req: {
        user: RequestUser;
    }, id: string): Promise<any>;
}
export {};
