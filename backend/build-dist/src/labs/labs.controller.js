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
exports.LabsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const client_1 = require("../../generated/prisma/client");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const create_lab_order_dto_1 = require("./dto/create-lab-order.dto");
const labs_service_1 = require("./labs.service");
let LabsController = class LabsController {
    labsService;
    constructor(labsService) {
        this.labsService = labsService;
    }
    createOrder(req, dto) {
        return this.labsService.createOrder(req.user.userId, dto);
    }
    assign(req, id) {
        return this.labsService.assignOrder(req.user.userId, id);
    }
    sampleCollected(req, id) {
        return this.labsService.collectSample(req.user.userId, id);
    }
    resultUploaded(req, id, files) {
        return this.labsService.uploadResult(req.user.userId, id, files);
    }
    sent(req, id) {
        return this.labsService.markSent(req.user.userId, id);
    }
    listMine(req) {
        return this.labsService.listMine(req.user.userId, req.user.role);
    }
    getResult(req, id) {
        return this.labsService.getResult(req.user.userId, req.user.role, id);
    }
};
exports.LabsController = LabsController;
__decorate([
    (0, common_1.Post)('orders'),
    (0, roles_decorator_1.Roles)(client_1.Role.DOCTOR),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_lab_order_dto_1.CreateLabOrderDto]),
    __metadata("design:returntype", void 0)
], LabsController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Patch)('orders/:id/assign'),
    (0, roles_decorator_1.Roles)(client_1.Role.DIAGNOSTIC),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LabsController.prototype, "assign", null);
__decorate([
    (0, common_1.Patch)('orders/:id/sample-collected'),
    (0, roles_decorator_1.Roles)(client_1.Role.DIAGNOSTIC),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LabsController.prototype, "sampleCollected", null);
__decorate([
    (0, common_1.Patch)('orders/:id/result-uploaded'),
    (0, roles_decorator_1.Roles)(client_1.Role.DIAGNOSTIC),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10)),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], LabsController.prototype, "resultUploaded", null);
__decorate([
    (0, common_1.Patch)('orders/:id/sent'),
    (0, roles_decorator_1.Roles)(client_1.Role.DIAGNOSTIC),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LabsController.prototype, "sent", null);
__decorate([
    (0, common_1.Get)('orders/me'),
    (0, roles_decorator_1.Roles)(client_1.Role.PATIENT, client_1.Role.DOCTOR, client_1.Role.DIAGNOSTIC),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LabsController.prototype, "listMine", null);
__decorate([
    (0, common_1.Get)('orders/:id/result'),
    (0, roles_decorator_1.Roles)(client_1.Role.PATIENT, client_1.Role.DOCTOR, client_1.Role.DIAGNOSTIC),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LabsController.prototype, "getResult", null);
exports.LabsController = LabsController = __decorate([
    (0, common_1.Controller)('labs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [labs_service_1.LabsService])
], LabsController);
//# sourceMappingURL=labs.controller.js.map