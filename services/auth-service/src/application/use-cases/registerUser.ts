import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { HashService } from "../../infrastructure/services/HashService";
import { User } from "../../domain/entities/User";

export class RegisterUser {
  constructor(
    private userRepository:IUserRepository,
    private hashService:HashService
  ){}

  async execute(fullName:string, email:string, password:string) {
    const existing = await this.userRepository.findByEmail(email);
    if(existing) throw new Error('user already exists');

    const hashed = await this.hashService.hash(password);
    const user:User = {
      id:undefined,
      fullName,
      email,
      password:hashed,
      createdAt:new Date(),
    };
    return this.userRepository.save(user);
  }
}
