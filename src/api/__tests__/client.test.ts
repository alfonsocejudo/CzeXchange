import { apiGet, ApiError } from '../client';

beforeEach(() => {
  jest.resetAllMocks();
});

it('returns response text on success', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    text: () => Promise.resolve('response body'),
  } as Response);

  const result = await apiGet('https://example.com/test');

  expect(result).toBe('response body');
  expect(fetch).toHaveBeenCalledWith('https://example.com/test');
});

it('throws ApiError on non-ok response', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    ok: false,
    status: 404,
    statusText: 'Not Found',
  } as Response);

  await expect(apiGet('https://example.com/missing')).rejects.toThrow(ApiError);
  await expect(apiGet('https://example.com/missing')).rejects.toMatchObject({
    status: 404,
    message: 'Request failed: 404 Not Found',
  });
});

it('throws on network failure', async () => {
  jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));

  await expect(apiGet('https://example.com/test')).rejects.toThrow(
    'Network error',
  );
});
