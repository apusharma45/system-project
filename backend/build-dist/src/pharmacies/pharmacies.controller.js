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
exports.PharmaciesController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../../generated/prisma/client");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const update_my_profile_dto_1 = require("./dto/update-my-profile.dto");
const pharmacies_service_1 = require("./pharmacies.service");
let PharmaciesController = class PharmaciesController {
    pharmaciesService;
    constructor(pharmaciesService) {
        this.pharmaciesService = pharmaciesService;
    }
    getMyProfile(req) {
        return this.pharmaciesService.getMyProfile(req.user.userId);
    }
    updateMyProfile(req, dto) {
        return this.pharmaciesService.updateMyProfile(req.user.userId, dto);
    }
};
exports.PharmaciesController = PharmaciesController;
__decorate([
    (0, common_1.Get)('me/profile'),
    (0, roles_decorator_1.Roles)(client_1.Role.PHARMACY),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PharmaciesController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Patch)('me/profile'),
    (0, roles_decorator_1.Roles)(client_1.Role.PHARMACY),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_my_profile_dto_1.UpdatePharmacyMyProfileDto]),
    __metadata("design:returntype", void 0)
], PharmaciesController.prototype, "updateMyProfile", null);
exports.PharmaciesController = PharmaciesController = __decorate([
    (0, common_1.Controller)('pharmacies'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [pharmacies_service_1.PharmaciesService])
], PharmaciesController);
//# sourceMappingURL=pharmacies.controller.js.map