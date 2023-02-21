import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import { ApiDetails, ApiDetailsFactory } from 'src/common';

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

function getPackageJSON(): any {
  try {
    return JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  } catch {
    throw new InternalServerErrorException('Failed to parse Package.json.');
  }
}

export function getAPIversion(): string {
  try {
    return getPackageJSON()?.version as string;
  } catch (error) {
    throw new InternalServerErrorException('Failed to parse API Version.');
  }
}

export function getAPIdetails(): ApiDetails {
  try {
    return ApiDetailsFactory(getPackageJSON());
  } catch {
    throw new InternalServerErrorException('Failed to parse API Details.');
  }
}

export function queryAPIdetails(field: string): string {
  try {
    return getPackageJSON()[field];
  } catch {
    throw new InternalServerErrorException('Failed to parse API Details.');
  }
}
