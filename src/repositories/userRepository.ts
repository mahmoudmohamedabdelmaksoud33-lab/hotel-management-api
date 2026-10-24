import { AppDataSource } from "../config/Database";
import { User } from "../entities/user";

export const UserRepository = AppDataSource.getRepository(User).extend({
  findByEmail(email: string) {
    return this.findOne({ where: { email } });
  },
  findById(id: string) {
    return this.findOne({ where: { id } });
  },
});
