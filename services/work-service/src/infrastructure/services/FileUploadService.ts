import { injectable } from "tsyringe";
import path from "path";
import fs from "fs";
import { IFileUploadService } from "../../domain/services/IFileUploadService";

@injectable()
export class FileUploadService implements IFileUploadService {
  private uploadDir = path.join(__dirname, "../../../uploads");

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File, folder: string): Promise<string> {
    const folderPath = path.join(this.uploadDir, folder);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(folderPath, fileName);

    // Save the file buffer to disk
    fs.writeFileSync(filePath, file.buffer);

    // Return relative path (used for serving files later)
    return `uploads/${folder}/${fileName}`;
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(__dirname, "../../../", filePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
}
