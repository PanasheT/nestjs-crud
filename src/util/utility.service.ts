import * as bcrypt from 'bcrypt';

export abstract class UtilityService {
  public async generateHash(password: string): Promise<string> {
    const saltRounds: string = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, saltRounds);
  }

  public async validateHash(attempt: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(attempt, hash);
  }
}
