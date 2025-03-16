import AuthToken from '../model/AuthToken';
import fetcher from '../util/fetcher';
import { PROFILE_ENDPOINT } from '../constant/endpoint';

export default class ProfileService {
     public async getProfile(authToken: AuthToken) {
          const { body } = await fetcher.get(
               PROFILE_ENDPOINT,
               {},
               {
                    headers: authToken.toObject(),
               }
          );
          console.log(body);
     }
}
