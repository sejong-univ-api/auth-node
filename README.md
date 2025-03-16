# SejongUnivAuth

## 목차

- [소개](#소개)
- [설치방법](#설치방법)
- [주요 기능](#주요-기능)
     - [login](#loginusername-string-password-string-promiseloginresponse)
     - [getProfile](#getprofileusername-string-password-string-promiseprofile)
- [반환 객체](#반환-객체)
     - [LoginResponse](#loginresponse)
     - [Token](#token)
     - [Profile](#profile)
- [오류 처리](#오류-처리)
     - [ConnectionError](#connectionerror)
     - [InvalidCredentialError](#invalidcredentialerror)
- [사용예시](#사용예시)
     - [CJS](#cjs)
     - [ESM](#esm)
- [이슈등록](#이슈등록)
- [패치내역](#패치내역)

## 소개

SejongUnivAuth는 세종대학교 통합인증 시스템을 위해 개발된 라이브러리입니다. 사용자의 ID와 패스워드를 이용해 세종대학교 시스템에 로그인하고, 인증된 세션을 통해 사용자의 프로필 정보를 가져올 수 있습니다.

## 설치방법

npm을 통해 라이브러리를 설치하여 사용하는 것이 권장됩니다.

```shell
npm i @sejong-univ-auth/auth
```

## 주요 기능

### `login(username: string, password: string): Promise<LoginResponse>`

#### 설명

세종대학교 통합인증 시스템을 통해 사용자 로그인을 수행합니다.

#### 인자

- `username`: 세종대학교 통합인증 ID
- `password`: 세종대학교 통합인증 비밀번호

#### 반환값

| 조건 | 반환 타입                | 설명                                             |
| ---- | ------------------------ | ------------------------------------------------ |
| 성공 | `LoginResponse`          | 인증 성공 및 토큰 정보                           |
| 실패 | `InvalidCredentialError` | 로그인 정보(아이디/비밀번호)가 올바르지 않을 때  |
| 실패 | `ConnectionError`        | 네트워크 연결 문제 또는 서버 응답 형식 오류일 때 |

### `getProfile(username: string, password: string): Promise<Profile>`

#### 설명

세종대학교 통합인증 시스템을 통해 로그인 후 사용자 프로필 정보를 조회합니다.

#### 인자

- `username`: 세종대학교 통합인증 ID
- `password`: 세종대학교 통합인증 비밀번호

#### 반환값

| 조건 | 반환 타입                | 설명                                             |
| ---- | ------------------------ | ------------------------------------------------ |
| 성공 | `Profile`                | 사용자 프로필 정보                               |
| 실패 | `InvalidCredentialError` | 로그인 정보(아이디/비밀번호)가 올바르지 않을 때  |
| 실패 | `ConnectionError`        | 네트워크 연결 문제 또는 서버 응답 형식 오류일 때 |

## 반환 객체

### LoginResponse

사용자 로그인 결과 정보를 담는 객체입니다.

| 필드명  | 타입    | 설명             |
| ------- | ------- | ---------------- |
| success | boolean | 로그인 성공 여부 |
| token   | Token   | 인증 토큰 정보   |

### Token

사용자 인증 토큰 정보를 담는 객체입니다.

| 필드명     | 타입   | 설명          |
| ---------- | ------ | ------------- |
| jsessionid | string | 세션 식별자   |
| ssotoken   | string | SSO 토큰 정보 |

### Profile

사용자 프로필 정보를 담는 객체입니다.

| 필드명                   | 타입   | 설명             |
| ------------------------ | ------ | ---------------- |
| major                    | string | 전공             |
| studentCode              | string | 학번             |
| name                     | string | 이름             |
| grade                    | number | 학년             |
| userStatus               | string | 사용자 상태      |
| totalSemesters           | number | 이수 학기 수     |
| readingVerifiedSemesters | number | 인증완료 학기 수 |
| readingCertification     | string | 독서인증 여부    |

## 오류 처리

이 라이브러리는 다음과 같은 오류 타입을 제공합니다.

### ConnectionError

네트워크 연결 문제나 서버 응답 형식이 올바르지 않을 때 발생하는 오류입니다.

```js
try {
     await sejongUnivAuth.login(username, password);
} catch (error) {
     if (error.name === 'ConnectionError') {
          console.error('서버 연결에 문제가 있습니다:', error.message);
          console.error('상태 코드:', error.statusCode);
     }
}
```

### InvalidCredentialError

사용자 인증 정보(아이디/비밀번호)가 올바르지 않을 때 발생하는 오류입니다.

```js
try {
     await sejongUnivAuth.login(username, password);
} catch (error) {
     if (error.name === 'InvalidCredentialError') {
          console.error('로그인에 실패했습니다:', error.message);
     }
}
```

## 사용예시

`CJS(CommonJS)`와 `ESM(ES Modules)` 방식 모두 지원됩니다.

### CJS

```js
const sejongUnivAuth = require('@sejong-univ-auth/auth').default;
// const { login, getProfile } = require('@sejong-univ-auth/auth')

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
```

### ESM

```js
import sejongUnivAuth from '@sejong-univ-auth/auth';

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
```

## 이슈등록

코드에 오류 및 개선사항이 있을 경우 해당 저장소에 이슈를 남겨주시면 감사하겠습니다.  
[`sejong-univ-auth GitHub`](https://github.com/username/sejong-univ-auth/issues)

## 패치내역

### 2024-05-23

- 최초 기능 릴리즈

### 2025-03-17

- 변경된 학사 api 반영
- 메서드 호출 방식 변경
- ConnectionError와 InvalidCredentialError 오류 처리 구현
- CJS/ESM 방식 모두 지원
