export interface ICloudinaryUploadResult {
    url: string;
    publicId: string;
    resourceType: "image" | "video";
    format: string;
    width?: number;
    height?: number;
    duration?: number;
    bytes: number;
}

export interface ICloudinaryService {
    uploadBuffer(buffer: Buffer,folder: string,resourceType: "image" | "video"): Promise<ICloudinaryUploadResult>;
    deleteFile(publicId: string,resourceType: "image" | "video"): Promise<void>;
    generateUploadSignature( paramsToSign: Record<string, string | number>): {signature: string;timestamp: number;};
}