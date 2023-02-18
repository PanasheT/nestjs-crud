import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export async function generateHash(password: string): Promise<string> {
  const saltRounds: string = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, saltRounds);
}

export async function validateHash(
  attempt: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(attempt, hash);
}

export function validateUpdate<T>(model: T, update: Partial<T>): Partial<T> {
  const validated: Partial<T> = Object.keys(update).reduce((validated, key) => {
    if (update[key] && model[key] !== update[key]) {
      validated[key] = update[key];
    }
    return validated;
  }, {});

  if (Object.entries(validated).length === 0) {
    throw new BadRequestException('No changes were made.');
  }

  return validated;
}
