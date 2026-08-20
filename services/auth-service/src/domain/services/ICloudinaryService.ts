export interface ICloudinaryService {
    generateUploadSignature(paramsToSign: Record<string, string | number>):{signature:string, timestamp:string};
    deleteFile(publicId:string):Promise<void>;
}