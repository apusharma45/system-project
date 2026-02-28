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
exports.AppointmentsController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../../generated/prisma/client");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const appointments_service_1 = require("./appointments.service");
const create_appointment_dto_1 = require("./dto/create-appointment.dto");
let AppointmentsController = class AppointmentsController {
    appointmentsService;
    constructor(appointmentsService) {
        this.appointmentsService = appointmentsService;
    }
    create(req, dto) {
        return this.appointmentsService.createForPatient(req.user.userId, dto);
    }
    listMine(req) {
        return this.appointmentsService.listMine(req.user.userId, req.user.role);
    }
    confirm(req, id) {
        return this.appointmentsService.confirmByDoctor(req.user.userId, id);
    }
    call(req, id) {
        return this.appointmentsService.callByDoctor(req.user.userId, id);
    }
    markInVisit(req, id) {
        return this.appointmentsService.markInVisitByDoctor(req.user.userId, id);
    }
    markExamDone(req, id) {
        return this.appointmentsService.markExamDoneByDoctor(req.user.userId, id);
    }
    close(req, id) {
        return this.appointmentsService.closeByDoctor(req.user.userId, id);
    }
    cancel(req, id) {
        if (req.user.role === client_1.Role.DOCTOR) {
            return this.appointmentsService.cancelByDoctor(req.user.userId, id);
        }
        return this.appointmentsService.cancelByPatient(req.user.userId, id);
    }
};
exports.AppointmentsController = AppointmentsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.PATIENT),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_appointment_dto_1.CreateAppointmentDto]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, roles_decorator_1.Roles)(client_1.Role.PATIENT, client_1.Role.DOCTOR),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "listMine", null);
__decorate([
    (0, common_1.Patch)(':id/confirm'),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "confirm", null);
__decorate([
    (0, common_1.Patch)(':id/call'),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "call", null);
__decorate([
    (0, common_1.Patch)(':id/in-visit'),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "markInVisit", null);
__decorate([
    (0, common_1.Patch)(':id/exam-done'),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "markExamDone", null);
__decorate([
    (0, common_1.Patch)(':id/close'),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "close", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, roles_decorator_1.Roles)(client_1.Role.PATIENT, client_1.Role.DOCTOR),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "cancel", null);
exports.AppointmentsController = AppointmentsController = __decorate([
    (0, common_1.Controller)('appointments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [appointments_service_1.AppointmentsService])
], AppointmentsController);
//# sourceMappingURL=appointments.controller.js.map