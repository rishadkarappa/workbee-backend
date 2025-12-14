
import { container } from "tsyringe";

import { HashService } from "../services/HashServices";

import { IHashService } from "../../domain/services/IHashService";
import { IFileUploadService } from "../../domain/services/IFileUploadService";

import { FileUploadService } from "../services/FileUploadService";
import { IEmailService } from "../../domain/services/IEmailService";
import { EmailService } from "../services/EmailService";

container.registerSingleton<IHashService>("HashService",HashService)
container.registerSingleton<IFileUploadService>("FileUploadService",FileUploadService)
container.registerSingleton<IEmailService>("EmailService",EmailService)
