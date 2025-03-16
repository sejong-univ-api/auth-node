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
          const fakeResponse = "<script>var result = 'OK';</script>";
          (fetcher.post as jest.Mock).mockResolvedValue(fakeResponse);

          // When
          const result = authService.login('testUser', 'testPass');

          // Then
          await expect(result).resolves.toBe(true);
          expect(fetcher.post).toHaveBeenCalledTimes(1);
     });

     it('로그인 실패', async () => {
          // Given
          const fakeResponse = "<script>var result = 'erridpwd';</script>";
          (fetcher.post as jest.Mock).mockResolvedValue(fakeResponse);

          // When
          const result = authService.login('testUser', 'wrongPass');

          // Then
          await expect(result).rejects.toThrow(InvalidCredentialError);
          expect(fetcher.post).toHaveBeenCalledTimes(1);
     });

     it('Json 응답이 오는 경우', async () => {
          // Given
          const fakeResponse = { data: 'not a string' };
          (fetcher.post as jest.Mock).mockResolvedValue(fakeResponse);

          // When
          const result = authService.login('testUser', 'testPass');

          // Then
          await expect(result).rejects.toThrow(ConnectionError);
          expect(fetcher.post).toHaveBeenCalledTimes(1);
     });

     it('result가 없는 경우', async () => {
          // Given
          const fakeResponse = '<html>No result variable here</html>';
          (fetcher.post as jest.Mock).mockResolvedValue(fakeResponse);

          // When
          const result = authService.login('testUser', 'testPass');

          // Then
          await expect(result).rejects.toThrow(ConnectionError);
          expect(fetcher.post).toHaveBeenCalledTimes(1);
     });
});
