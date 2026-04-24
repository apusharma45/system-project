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
exports.PatientsController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../../generated/prisma/client");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const update_my_profile_dto_1 = require("./dto/update-my-profile.dto");
const patients_service_1 = require("./patients.service");
let PatientsController = class PatientsController {
    patientsService;
    constructor(patientsService) {
        this.patientsService = patientsService;
    }
    listPatients() {
        return this.patientsService.listPatientsForAdmin();
    }
    getMyProfile(req) {
        return this.patientsService.getMyProfile(req.user.userId);
    }
    updateMyProfile(req, dto) {
        return this.patientsService.updateMyProfile(req.user.userId, dto);
    }
    getProfileForAdmin(patientId) {
        return this.patientsService.getProfileForAdmin(patientId);
    }
    updateProfileForAdmin(patientId, dto) {
        return this.patientsService.updateProfileForAdmin(patientId, dto);
    }
    getProfile(req, patientId) {
        return this.patientsService.getProfileForDoctor(req.user.userId, patientId);
    }
};
exports.PatientsController = PatientsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "listPatients", null);
__decorate([
    (0, common_1.Get)('me/profile'),
    (0, roles_decorator_1.Roles)(client_1.Role.PATIENT),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Patch)('me/profile'),
    (0, roles_decorator_1.Roles)(client_1.Role.PATIENT),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_my_profile_dto_1.UpdateMyProfileDto]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "updateMyProfile", null);
__decorate([
    (0, common_1.Get)(':patientId/admin-profile'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "getProfileForAdmin", null);
__decorate([
    (0, common_1.Patch)(':patientId/admin-profile'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_my_profile_dto_1.UpdateMyProfileDto]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "updateProfileForAdmin", null);
__decorate([
    (0, common_1.Get)(':patientId/profile'),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('patientId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "getProfile", null);
exports.PatientsController = PatientsController = __decorate([
    (0, common_1.Controller)('patients'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [patients_service_1.PatientsService])
], PatientsController);
//# sourceMappingURL=patients.controller.js.map