import AuthService from '../service/auth-service';

export default class AuthController {
     constructor(private readonly authService: AuthService) {
          this.authService = authService;
     }

     async login(username: string, password: string): Promise<boolean> {
          const { success } = await this.authService.login(username, password);
          return success;
     }
}
