import { Role } from '../../generated/prisma/client';
import { CreateLabOrderDto } from './dto/create-lab-order.dto';
import { LabsService } from './labs.service';
type RequestUser = {
    userId: string;
    role: Role;
};
type UploadedLabFile = {
    originalname: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
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
    }, id: string, files: UploadedLabFile[] | undefined): Promise<{
        labOrderId: string;
        uploadedCount: number;
        reports: {
            id: string;
            labOrderId: string;
            fileUrl: string;
            filePublicId?: string | null;
            fileMimeType?: string | null;
            fileSizeBytes?: number | null;
            uploadedAt: Date;
        }[];
    }>;
    sent(req: {
        user: RequestUser;
    }, id: string): Promise<any>;
    listMine(req: {
        user: RequestUser;
    }): Promise<any>;
    getResult(req: {
        user: RequestUser;
    }, id: string): Promise<any>;
}
export {};
