export class ApiDetails {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
}

export function ApiDetailsFactory({
  name,
  version,
  description,
  author,
  license,
}: any): ApiDetails {
  return Object.assign(new ApiDetails(), {
    name,
    version,
    description,
    author,
    license,
  });
}
