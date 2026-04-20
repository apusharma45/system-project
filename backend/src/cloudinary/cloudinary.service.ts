import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createHash } from 'crypto';

type UploadParams = {
  buffer: Buffer;
  fileName: string;
  folder: string;
  contentType: string;
  resourceType?: 'image' | 'raw' | 'auto';
};

type UploadResult = {
  url: string;
  publicId: string;
  version: number;
  mimeType: string;
  bytes: number;
};

type CloudinaryCredentials = {
  cloudName?: string;
  apiKey?: string;
  apiSecret?: string;
};

@Injectable()
export class CloudinaryService {
  async uploadBuffer(params: UploadParams): Promise<UploadResult> {
    const { cloudName, apiKey, apiSecret } = this.getCredentials();

    // Local/dev fallback when cloudinary credentials are not configured yet.
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
    const signature = createHash('sha1').update(signatureBase).digest('hex');
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
      throw new InternalServerErrorException(
        `Cloudinary upload failed: ${await this.extractErrorMessage(response)}`,
      );
    }

    const payload = (await response.json()) as {
      secure_url: string;
      public_id: string;
      version: number;
      bytes: number;
      resource_type: string;
      format?: string;
    };

    return {
      url: payload.secure_url,
      publicId: payload.public_id,
      version: payload.version ?? 1,
      mimeType: params.contentType,
      bytes: payload.bytes ?? params.buffer.length,
    };
  }

  async destroy(publicId: string, resourceType: 'image' | 'raw' | 'video' = 'raw') {
    const { cloudName, apiKey, apiSecret } = this.getCredentials();
    if (!cloudName || !apiKey || !apiSecret) {
      return { result: 'not_configured' };
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const signatureBase = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = createHash('sha1').update(signatureBase).digest('hex');
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
      throw new InternalServerErrorException(
        `Cloudinary delete failed: ${await this.extractErrorMessage(response)}`,
      );
    }
    return response.json();
  }

  private getCredentials(): CloudinaryCredentials {
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
    } catch {
      return fromVars;
    }
  }

  private async extractErrorMessage(response: Response): Promise<string> {
    const fallback = `${response.status} ${response.statusText}`.trim();

    try {
      const payload = (await response.json()) as {
        error?: { message?: string };
      };
      return payload.error?.message || fallback;
    } catch {
      try {
        const text = await response.text();
        return text || fallback;
      } catch {
        return fallback;
      }
    }
  }
}
