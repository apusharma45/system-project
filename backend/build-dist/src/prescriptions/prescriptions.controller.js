"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const client_1 = require("../../generated/prisma/client");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const create_prescription_dto_1 = require("./dto/create-prescription.dto");
const update_prescription_notes_dto_1 = require("./dto/update-prescription-notes.dto");
const prescriptions_service_1 = require("./prescriptions.service");
let PrescriptionsController = class PrescriptionsController {
    prescriptionsService;
    constructor(prescriptionsService) {
        this.prescriptionsService = prescriptionsService;
    }
    create(req, dto) {
        return this.prescriptionsService.createDraft(req.user.userId, dto);
    }
    sign(req, id, dto) {
        return this.prescriptionsService.signByDoctor(req.user.userId, id, dto);
    }
    sendPatient(req, id) {
        return this.prescriptionsService.sendToPatientByDoctor(req.user.userId, id);
    }
    sendPharmacy(req, id) {
        return this.prescriptionsService.sendToPharmacyByDoctor(req.user.userId, id);
    }
    uploadDocument(req, id, file) {
        return this.prescriptionsService.uploadDocumentByDoctor(req.user.userId, id, file);
    }
    dispense(req, id) {
        return this.prescriptionsService.dispenseByPharmacy(req.user.userId, id);
    }
    listMine(req) {
        return this.prescriptionsService.listMine(req.user.userId, req.user.role);
    }
    getOne(req, id) {
        return this.prescriptionsService.getOne(req.user.userId, req.user.role, id);
    }
};
exports.PrescriptionsController = PrescriptionsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_prescription_dto_1.CreatePrescriptionDto]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/sign'),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_prescription_notes_dto_1.UpdatePrescriptionNotesDto]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "sign", null);
__decorate([
    (0, common_1.Patch)(':id/send-patient'),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "sendPatient", null);
__decorate([
    (0, common_1.Patch)(':id/send-pharmacy'),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "sendPharmacy", null);
__decorate([
    (0, common_1.Patch)(':id/upload-document'),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Patch)(':id/dispense'),
    (0, roles_decorator_1.Roles)(client_1.Role.PHARMACY),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "dispense", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR, client_1.Role.PATIENT, client_1.Role.PHARMACY),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "listMine", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR, client_1.Role.PATIENT, client_1.Role.PHARMACY),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "getOne", null);
exports.PrescriptionsController = PrescriptionsController = __decorate([
    (0, common_1.Controller)('prescriptions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [prescriptions_service_1.PrescriptionsService])
], PrescriptionsController);
//# sourceMappingURL=prescriptions.controller.js.map