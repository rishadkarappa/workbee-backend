import { injectable } from 'tsyringe';
import bcrypt from 'bcryptjs'
import { IHashService } from '../../domain/services/IHashService';

@injectable()
export class HashService implements IHashService{
    async hash(password:string):Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt)
    }

    async compare(password:string, hash:string) : Promise<boolean> {
        return bcrypt.compare(password, hash)
    }
}