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
export declare class CloudinaryService {
    uploadBuffer(params: UploadParams): Promise<UploadResult>;
    destroy(publicId: string, resourceType?: 'image' | 'raw' | 'video'): Promise<any>;
    private getCredentials;
    private extractErrorMessage;
}
export {};
