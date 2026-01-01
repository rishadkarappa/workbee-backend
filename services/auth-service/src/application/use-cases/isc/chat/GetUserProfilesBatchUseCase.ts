// import { inject, injectable } from 'tsyringe';
// import { IUserRepository } from '../../../../domain/repositories/IUserRepository';

// @injectable()
// export class GetUserProfilesBatchUseCase {
//   constructor(
//     @inject("UserRepository") private userRepository: IUserRepository
//   ) {}

//   async execute(userIds: string[]) {
//     if (!userIds || userIds.length === 0) {
//       return [];
//     }

//     const users = await this.userRepository.findByIds(userIds);
    
//     // Map to safe profile data
//     return users.map(user => ({
//       id: user.id || user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       phone: user.phone
//     }));
//   }
// }
