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

@Injectable()
export class CloudinaryService {
  async uploadBuffer(params: UploadParams): Promise<UploadResult> {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

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
      throw new InternalServerErrorException('Cloudinary upload failed');
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
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
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
      throw new InternalServerErrorException('Cloudinary delete failed');
    }
    return response.json();
  }
}
