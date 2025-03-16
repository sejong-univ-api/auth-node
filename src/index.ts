import AuthService from './service/auth-service';
import ProfileService from './service/profile-service';
import AuthController, { LoginResponse } from './controller/auth-controller';
import ProfileController, { Profile } from './controller/profile-controller';

const authService = new AuthService();
const profileService = new ProfileService();
const authController = new AuthController(authService);
const profileController = new ProfileController(profileService, authService);

export async function login(username: string, password: string): Promise<LoginResponse> {
     return await authController.login(username, password);
}

export async function getProfile(username: string, password: string): Promise<Profile> {
     return await profileController.getProfile(username, password);
}

export const sejongUnivAuth = {
     login,
     getProfile,
};

export default sejongUnivAuth;