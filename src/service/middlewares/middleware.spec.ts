import { UserMiddleware } from './middleware';

describe('MiddlewaresMiddleware', () => {
  it('should be defined', () => {
    expect(new UserMiddleware()).toBeDefined();
  });
});
