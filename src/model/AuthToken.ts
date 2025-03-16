export default class AuthToken {
     public readonly jsessionid: string;
     public readonly ssotoken: string;

     constructor(jsessionid: string, ssotoken: string) {
          this.jsessionid = jsessionid || '';
          this.ssotoken = ssotoken || '';
     }

     static of(jsessionid: string, ssotoken: string): AuthToken {
          return new AuthToken(jsessionid, ssotoken);
     }

     toObject(): { jsessionid: string; ssotoken: string } {
          return {
               jsessionid: this.jsessionid,
               ssotoken: this.ssotoken,
          };
     }
}
