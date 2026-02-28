import { Role } from '../../generated/prisma/client';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionNotesDto } from './dto/update-prescription-notes.dto';
import { PrescriptionsService } from './prescriptions.service';
type RequestUser = {
    userId: string;
    role: Role;
};
export declare class PrescriptionsController {
    private readonly prescriptionsService;
    constructor(prescriptionsService: PrescriptionsService);
    create(req: {
        user: RequestUser;
    }, dto: CreatePrescriptionDto): Promise<any>;
    sign(req: {
        user: RequestUser;
    }, id: string, dto?: UpdatePrescriptionNotesDto): Promise<any>;
    sendPatient(req: {
        user: RequestUser;
    }, id: string): Promise<any>;
    sendPharmacy(req: {
        user: RequestUser;
    }, id: string): Promise<any>;
    dispense(req: {
        user: RequestUser;
    }, id: string): Promise<any>;
    listMine(req: {
        user: RequestUser;
    }): any;
    getOne(req: {
        user: RequestUser;
    }, id: string): Promise<any>;
}
export {};
