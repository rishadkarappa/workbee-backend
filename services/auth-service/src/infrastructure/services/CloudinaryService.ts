import { injectable } from "tsyringe";
import { ICloudinaryService } from "../../domain/services/ICloudinaryService";
import { v2 as cloudinary } from "cloudinary";
import { ENV } from "../config/env";


@injectable()
export class CloudinaryService implements ICloudinaryService {
    constructor( ){
        cloudinary.config({
            cloud_name:ENV.
        }) 
    }
}