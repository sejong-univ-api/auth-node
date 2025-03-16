import ProfileService from 'service/profile-service';
import AuthService from 'service/auth-service';

export interface Profile {
     major: string;
     studentCode: string;
     name: string;
     grade: number;
     userStatus: string;
     totalSemesters: number;
     readingVerifiedSemesters: number;
     readingCertification: string;
}

export default class ProfileController {
     constructor(
          private readonly profileService: ProfileService,
          private readonly authService: AuthService
     ) {
          this.profileService = profileService;
          this.authService = authService;
     }

     async getProfile(username: string, password: string): Promise<Profile> {
          const { token } = await this.authService.login(username, password);
          const profile = await this.profileService.getProfile(token);
          return profile.toObject();
     }
}
