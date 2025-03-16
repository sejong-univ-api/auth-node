import sejongUnivAuth from '@sejong-univ-api/auth-node';

async function getUserProfile(username, password) {
     try {
          const profile = await sejongUnivAuth.getProfile(username, password);
          console.log('사용자 정보:', profile);
          return profile;
     } catch (error) {
          if (error.name === 'InvalidCredentialError') {
               console.error('로그인 정보가 올바르지 않습니다:', error.message);
          } else if (error.name === 'ConnectionError') {
               console.error('서버 연결에 문제가 있습니다:', error.message);
               console.error('상태 코드:', error.statusCode);
          } else {
               console.error('알 수 없는 오류 발생:', error);
          }
          throw error;
     }
}

getUserProfile('21013216', 'kk30516*');
