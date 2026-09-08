import { test, expect } from '@playwright/test';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('Posts API', () => {
  test('GET /posts returns a full list of posts', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/posts`);
    expect(response.status()).toBe(200);

    const posts = await response.json();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts).toHaveLength(100);
    expect(posts[0]).toEqual(
      expect.objectContaining({ id: 1, userId: expect.any(Number), title: expect.any(String) })
    );
  });

  test('GET /posts/:id returns a single post with the right shape', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/posts/1`);
    expect(response.status()).toBe(200);

    const post = await response.json();
    expect(post.id).toBe(1);
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('body');
  });

  test('GET /posts/:id returns 404 for a non-existent post', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/posts/9999`);
    expect(response.status()).toBe(404);
  });

  test('POST /posts creates a new post', async ({ request }) => {
    const payload = { title: 'QA Automation Portfolio', body: 'Testing the fake API', userId: 1 };
    const response = await request.post(`${BASE_URL}/posts`, { data: payload });
    expect(response.status()).toBe(201);

    const created = await response.json();
    expect(created).toEqual(expect.objectContaining(payload));
    expect(created.id).toBeGreaterThan(0);
  });

  test('DELETE /posts/:id removes a post', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/posts/1`);
    expect(response.status()).toBe(200);
  });
});
