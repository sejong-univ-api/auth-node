export default class Profile {
     /**
      * 학과명
      */
     public readonly major: string;
     /**
      * 학번
      */
     public readonly studentCode: string;
     /**
      * 이름
      */
     public readonly name: string;
     /**
      * 학년
      */
     public readonly grade: number;
     /**
      * 사용자 상태
      */
     public readonly userStatus: string;
     /**
      * 이수 학기
      */
     public readonly totalSemesters: number;
     /**
      * 인증 완료 학기
      */
     public readonly readingVerifiedSemesters: number;
     /**
      * 인증 여부
      */
     public readonly readingCertification: string;

     constructor(
          major: string,
          studentCode: string,
          name: string,
          grade: number,
          userStatus: string,
          totalSemesters: number,
          readingVerifiedSemesters: number,
          readingCertification: string
     ) {
          this.major = major;
          this.studentCode = studentCode;
          this.name = name;
          this.grade = grade;
          this.userStatus = userStatus;
          this.totalSemesters = totalSemesters;
          this.readingVerifiedSemesters = readingVerifiedSemesters;
          this.readingCertification = readingCertification;
     }

     public static of(
          major: string,
          studentCode: string,
          name: string,
          grade: number,
          userStatus: string,
          totalSemesters: number,
          readingVerifiedSemesters: number,
          readingCertification: string
     ): Profile {
          return new Profile(
               major,
               studentCode,
               name,
               grade,
               userStatus,
               totalSemesters,
               readingVerifiedSemesters,
               readingCertification
          );
     }

     toObject(): {
          major: string;
          studentCode: string;
          name: string;
          grade: number;
          userStatus: string;
          totalSemesters: number;
          readingVerifiedSemesters: number;
          readingCertification: string;
     } {
          return {
               major: this.major,
               studentCode: this.studentCode,
               name: this.name,
               grade: this.grade,
               userStatus: this.userStatus,
               totalSemesters: this.totalSemesters,
               readingVerifiedSemesters: this.readingVerifiedSemesters,
               readingCertification: this.readingCertification,
          };
     }
}
