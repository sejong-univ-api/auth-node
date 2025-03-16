import AuthToken from '../model/AuthToken';
import fetcher from '../util/fetcher';
import { PROFILE_ENDPOINT } from '../constant/endpoint';
import Profile from '../model/Profile';
import { load } from 'cheerio';
import ConnectionError from '../error/connection-error';

export default class ProfileService {
     public async getProfile(authToken: AuthToken): Promise<Profile> {
          const { body } = await fetcher.get(
               PROFILE_ENDPOINT,
               {},
               {
                    cookies: authToken.toObject(),
               }
          );

          if (typeof body !== 'string') {
               throw new ConnectionError('요청에 실패하였습니다', 404);
          }

          return this.parseProfileFromHtml(body);
     }

     private parseProfileFromHtml(html: string): Profile {
          const $ = load(html);
          const profileData: Record<string, string> = {};

          $('table.b-board-table tbody tr').each((_, el) => {
               const key = $(el).find('th.td-left').text().trim();
               const value = $(el).find('td.td-left').text().trim();
               profileData[key] = value;
          });

          const major = profileData['학과명'] ?? '';
          const studentCode = profileData['학번'] ?? '';
          const name = profileData['이름'] ?? '';
          const grade = Number(profileData['학년']) || -1;
          const userStatus = profileData['사용자 상태'] ?? '';
          const totalSemesters = Number(profileData['이수 학기'].split(' ')[0]) || -1;
          const verifiedSemesters = Number(profileData['인증완료 학기'].split(' ')[0]) || -1;
          const certification = profileData['인증여부'] ?? '';

          return Profile.of(
               major,
               studentCode,
               name,
               grade,
               userStatus,
               totalSemesters,
               verifiedSemesters,
               certification
          );
     }
}
