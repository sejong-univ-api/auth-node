import AuthService from 'service/auth-service';

export interface Token {
     jsessionid: string;
     ssotoken: string;
}
export interface LoginResponse {
     success: boolean;
     token: Token;
}

export default class AuthController {
     constructor(private readonly authService: AuthService) {
          this.authService = authService;
     }

     async login(username: string, password: string): Promise<LoginResponse> {
          const response = await this.authService.login(username, password);
          return {
               success: response.success,
               token: response.token.toObject(),
          };
     }
}
