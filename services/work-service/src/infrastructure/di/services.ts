
import { container } from "tsyringe";

import { HashService } from "../services/HashServices";

import { IHashService } from "../../domain/services/IHashService";
import { IFileUploadService } from "../../domain/services/IFileUploadService";

import { FileUploadService } from "../services/FileUploadService";

container.registerSingleton<IHashService>("HashService",HashService)
container.registerSingleton<IFileUploadService>("FileUploadService",FileUploadService)
