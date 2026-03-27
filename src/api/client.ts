const BASE_URL = 'https://www.cnb.cz/en';

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiGet(path: string): Promise<string> {
  const response = await fetch(`${BASE_URL}${path}`);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `Request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.text();
}

export {ApiError};
