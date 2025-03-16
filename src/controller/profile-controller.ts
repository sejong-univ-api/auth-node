import ProfileService from "../service/profile-service";
import AuthService from "../service/auth-service";

export default class ProfileController {
    constructor(private readonly profileService: ProfileService, private readonly authService: AuthService) {
        this.profileService = profileService;
        this.authService = authService;
    }

    async getProfile(username: string, password: string): Promise<any> {
        const { token } = await this.authService.login(username, password);
        await this.profileService.getProfile(token);
        return "";
    }

}