import AuthService from '../service/auth-service';
import fetcher from '../util/fetcher';
import ConnectionError from '../error/connection-error';
import InvalidCredentialError from '../error/invalid-credential-error';

jest.mock('../util/fetcher', () => ({
     post: jest.fn(),
}));

describe('AuthService', () => {
     let authService: AuthService;

     beforeEach(() => {
          jest.clearAllMocks();
          authService = new AuthService();
     });

     it('로그인 성공', async () => {
          // Given
          const fakeResponse = {
               body: "<script>var result = 'OK';</script>",
               cookies: { JSESSIONID: 'dummyJS', ssotoken: 'dummySSO' },
          };
          (fetcher.post as jest.Mock).mockResolvedValue(fakeResponse);

          // When
          const result = authService.login('testUser', 'testPass');

          // Then
          await expect(result).resolves.toEqual({
               success: true,
               token: { jsessionid: 'dummyJS', ssotoken: 'dummySSO' },
          });
          expect(fetcher.post).toHaveBeenCalledTimes(1);
     });

     it('로그인 실패 (잘못된 인증 정보)', async () => {
          // Given
          const fakeResponse = {
               body: "<script>var result = 'erridpwd';</script>",
               cookies: { JSESSIONID: 'dummyJS', SSOTOKEN: 'dummySSO' },
          };
          (fetcher.post as jest.Mock).mockResolvedValue(fakeResponse);

          // When
          const result = authService.login('testUser', 'wrongPass');

          // Then
          await expect(result).rejects.toThrow(InvalidCredentialError);
          expect(fetcher.post).toHaveBeenCalledTimes(1);
     });

     it('Json 응답이 오는 경우 (응답 본문 타입 오류)', async () => {
          // Given
          const fakeResponse = {
               body: { data: 'not a string' },
               cookies: { JSESSIONID: 'dummyJS', SSOTOKEN: 'dummySSO' },
          };
          (fetcher.post as jest.Mock).mockResolvedValue(fakeResponse);

          // When
          const result = authService.login('testUser', 'testPass');

          // Then
          await expect(result).rejects.toThrow(ConnectionError);
          expect(fetcher.post).toHaveBeenCalledTimes(1);
     });

     it('result 변수가 없는 경우 (잘못된 응답)', async () => {
          // Given
          const fakeResponse = {
               body: '<html>No result variable here</html>',
               cookies: { JSESSIONID: 'dummyJS', SSOTOKEN: 'dummySSO' },
          };
          (fetcher.post as jest.Mock).mockResolvedValue(fakeResponse);

          // When
          const result = authService.login('testUser', 'testPass');

          // Then
          await expect(result).rejects.toThrow(ConnectionError);
          expect(fetcher.post).toHaveBeenCalledTimes(1);
     });
});
