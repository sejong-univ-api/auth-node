import ProfileService from '../service/profile-service';
import fetcher from '../util/fetcher';
import ConnectionError from '../error/connection-error';
import AuthToken from '../model/AuthToken';
import { PROFILE_ENDPOINT } from '../constant/endpoint';

jest.mock('../util/fetcher', () => ({
     get: jest.fn(),
}));

describe('ProfileService', () => {
     let profileService: ProfileService;
     let authToken: AuthToken;

     beforeEach(() => {
          jest.clearAllMocks();
          profileService = new ProfileService();
          authToken = AuthToken.of('dummySession', 'dummySSO');
     });

     it('프로필 조회 성공', async () => {
          // Given
          const fakeHtml = `
      <div class="co-board">
        <div class="bn-view-common type01">
          <div class="b-con-box">
            <h4 class="b-h4-tit01">사용자 정보</h4>
            <div class="table-wrap">
              <table class="b-board-table">
                <tbody>
                  <tr>
                    <th class="td-left" scope="row">학과명</th>
                    <td class="td-left">컴퓨터공학과</td>
                  </tr>
                  <tr>
                    <th class="td-left" scope="row">학번</th>
                    <td class="td-left">00000000</td>
                  </tr>
                  <tr>
                    <th class="td-left" scope="row">이름</th>
                    <td class="td-left">김세종</td>
                  </tr>
                  <tr>
                    <th class="td-left" scope="row">학년</th>
                    <td class="td-left">4</td>
                  </tr>
                  <tr>
                    <th class="td-left" scope="row">사용자 상태</th>
                    <td class="td-left">졸업</td>
                  </tr>
                  <tr>
                    <th class="td-left" scope="row">이수 학기</th>
                    <td class="td-left">8 학기</td>
                  </tr>
                  <tr>
                    <th class="td-left" scope="row">인증완료 학기</th>
                    <td class="td-left">6 학기</td>
                  </tr>
                  <tr>
                    <th class="td-left" scope="row">인증여부</th>
                    <td class="td-left">아니오(고전특강 대상자)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
          const fakeResponse = {
               body: fakeHtml,
               cookies: {},
          };
          (fetcher.get as jest.Mock).mockResolvedValue(fakeResponse);

          // When
          const profile = await profileService.getProfile(authToken);

          // Then
          expect(profile).toBeDefined();
          expect(profile.major).toBe('컴퓨터공학과');
          expect(profile.studentCode).toBe('00000000');
          expect(profile.name).toBe('김세종');
          expect(profile.grade).toBe(4);
          expect(profile.userStatus).toBe('졸업');
          expect(profile.totalSemesters).toBe(8);
          expect(profile.readingVerifiedSemesters).toBe(6);
          expect(profile.readingCertification).toBe('아니오(고전특강 대상자)');

          expect(fetcher.get).toHaveBeenCalledTimes(1);
          expect(fetcher.get).toHaveBeenCalledWith(
               PROFILE_ENDPOINT,
               {},
               { cookies: authToken.toObject() }
          );
     });

     it('응답 본문 타입 오류 발생', async () => {
          // Given
          const fakeResponse = {
               body: { data: 'not a string' },
               cookies: {},
          };
          (fetcher.get as jest.Mock).mockResolvedValue(fakeResponse);

          // When Then
          await expect(profileService.getProfile(authToken)).rejects.toThrow(ConnectionError);
          expect(fetcher.get).toHaveBeenCalledTimes(1);
     });
});
