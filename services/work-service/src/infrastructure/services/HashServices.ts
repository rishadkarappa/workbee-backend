import bcrypt from "bcryptjs";
import { injectable } from "tsyringe";
import { IHashService } from "../../domain/services/IHashService";

@injectable()
export class HashService implements IHashService{
    async hash(plainPassword: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(plainPassword, saltRounds)
    }

    async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword)
    }
}