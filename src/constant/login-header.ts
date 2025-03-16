const LOGIN_REQUEST_HEADER_FILED = {
     HOST: {
          key: 'Host',
          value: 'portal.sejong.ac.kr',
     },
     CONTENT_TYPE: {
          key: 'Content-Type',
          value: 'application/x-www-form-urlencoded; charset=UTF-8',
     },
     ACCEPT: {
          key: 'Accept',
          value: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
     },
     REFERER: {
          key: 'Referer',
          value: 'https://portal.sejong.ac.kr/jsp/login/loginSSL.jsp',
     },
     USER_AGENT: {
          key: 'User-Agent',
          value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
     },
};

export const LOGIN_REQUEST_HEADER = Object.fromEntries(
     Object.entries(LOGIN_REQUEST_HEADER_FILED).map(([key, { value }]) => [key, value])
);
