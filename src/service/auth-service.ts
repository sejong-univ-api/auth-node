import { LOGIN_ENDPOINT } from '../constant/endpoint';
import fetcher, { FetcherCookies, FetcherText } from '../util/fetcher';
import { LOGIN_REQUEST_HEADER } from '../constant/login-header';
import ConnectionError from '../error/connection-error';
import InvalidCredentialError from '../error/invalid-credential-error';
import AuthToken from '../model/AuthToken';

export default class AuthService {
     public async login(
          username: string,
          password: string
     ): Promise<{
          success: boolean;
          token: AuthToken;
     }> {
          const { body, cookies } = await this.requestLogin(username, password);
          const isLoginSuccessful = await this.checkLoginStatus(body);

          if (!isLoginSuccessful) {
               throw new InvalidCredentialError('로그인에 실패');
          }

          return {
               success: true,
               token: AuthToken.of(cookies['JSESSIONID'], cookies['SSOTOKEN']),
          };
     }

     private async requestLogin(
          username: string,
          password: string
     ): Promise<{ body: string; cookies: FetcherCookies }> {
          const { body, cookies } = await fetcher.post(
               LOGIN_ENDPOINT,
               {
                    id: username,
                    password,
               },
               {
                    formUrlEncoded: true,
                    headers: LOGIN_REQUEST_HEADER,
               }
          );

          if (typeof body !== 'string') {
               throw new ConnectionError('올바르지 않은 응답 유형', 404);
          }
          return {
               body,
               cookies,
          };
     }

     private async checkLoginStatus(html: FetcherText): Promise<boolean> {
          const loginResultRegex = /var\s+result\s*=\s*['"]([^'"]+)['"]/;
          const SUCCESS = 'OK';

          const match = html.match(loginResultRegex);
          if (!match) {
               throw new ConnectionError('올바르지 않은 응답 유형', 404);
          }

          const loginResult = match[1];
          if (loginResult === SUCCESS) {
               return true;
          }
          return false;
     }
}
