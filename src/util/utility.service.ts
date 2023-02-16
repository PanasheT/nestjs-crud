import * as bcrypt from 'bcrypt';

export abstract class UtilityService {
  public static async generateHash(password: string): Promise<string> {
    const saltRounds: string = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, saltRounds);
  }

  public static async validateHash(
    attempt: string,
    hash: string
  ): Promise<boolean> {
    return await bcrypt.compare(attempt, hash);
  }

  public static validateUpdate<T>(model: T, update: Partial<T>): Partial<T> {
    return Object.keys(update).reduce((validated, key) => {
      if (update[key] && model[key] !== update[key]) {
        validated[key] = update[key];
      }
      return validated;
    }, {});
  }
}
