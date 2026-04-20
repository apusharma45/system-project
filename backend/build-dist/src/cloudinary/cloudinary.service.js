"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let CloudinaryService = class CloudinaryService {
    async uploadBuffer(params) {
        const { cloudName, apiKey, apiSecret } = this.getCredentials();
        if (!cloudName || !apiKey || !apiSecret) {
            const fallbackId = `${params.folder}/${Date.now()}-${params.fileName}`;
            return {
                url: `data:${params.contentType};base64,${params.buffer.toString('base64')}`,
                publicId: fallbackId,
                version: 1,
                mimeType: params.contentType,
                bytes: params.buffer.length,
            };
        }
        const timestamp = Math.floor(Date.now() / 1000);
        const publicId = `${params.folder}/${Date.now()}-${params.fileName.replace(/\s+/g, '-')}`;
        const signatureBase = `folder=${params.folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
        const signature = (0, crypto_1.createHash)('sha1').update(signatureBase).digest('hex');
        const resourceType = params.resourceType ?? 'raw';
        const formData = new FormData();
        const binary = new Uint8Array(params.buffer);
        formData.append('file', new Blob([binary], { type: params.contentType }), params.fileName);
        formData.append('api_key', apiKey);
        formData.append('timestamp', String(timestamp));
        formData.append('signature', signature);
        formData.append('folder', params.folder);
        formData.append('public_id', publicId);
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            throw new common_1.InternalServerErrorException(`Cloudinary upload failed: ${await this.extractErrorMessage(response)}`);
        }
        const payload = (await response.json());
        return {
            url: payload.secure_url,
            publicId: payload.public_id,
            version: payload.version ?? 1,
            mimeType: params.contentType,
            bytes: payload.bytes ?? params.buffer.length,
        };
    }
    async destroy(publicId, resourceType = 'raw') {
        const { cloudName, apiKey, apiSecret } = this.getCredentials();
        if (!cloudName || !apiKey || !apiSecret) {
            return { result: 'not_configured' };
        }
        const timestamp = Math.floor(Date.now() / 1000);
        const signatureBase = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
        const signature = (0, crypto_1.createHash)('sha1').update(signatureBase).digest('hex');
        const formData = new FormData();
        formData.append('public_id', publicId);
        formData.append('api_key', apiKey);
        formData.append('timestamp', String(timestamp));
        formData.append('signature', signature);
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            throw new common_1.InternalServerErrorException(`Cloudinary delete failed: ${await this.extractErrorMessage(response)}`);
        }
        return response.json();
    }
    getCredentials() {
        const fromVars = {
            cloudName: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
            apiKey: process.env.CLOUDINARY_API_KEY?.trim(),
            apiSecret: process.env.CLOUDINARY_API_SECRET?.trim(),
        };
        if (fromVars.cloudName && fromVars.apiKey && fromVars.apiSecret) {
            return fromVars;
        }
        const cloudinaryUrl = process.env.CLOUDINARY_URL?.trim();
        if (!cloudinaryUrl) {
            return fromVars;
        }
        try {
            const parsed = new URL(cloudinaryUrl);
            const cloudName = parsed.hostname?.trim();
            const apiKey = decodeURIComponent(parsed.username || '').trim();
            const apiSecret = decodeURIComponent(parsed.password || '').trim();
            return {
                cloudName: cloudName || fromVars.cloudName,
                apiKey: apiKey || fromVars.apiKey,
                apiSecret: apiSecret || fromVars.apiSecret,
            };
        }
        catch {
            return fromVars;
        }
    }
    async extractErrorMessage(response) {
        const fallback = `${response.status} ${response.statusText}`.trim();
        try {
            const payload = (await response.json());
            return payload.error?.message || fallback;
        }
        catch {
            try {
                const text = await response.text();
                return text || fallback;
            }
            catch {
                return fallback;
            }
        }
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)()
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map