class TimeFormatter {
    static beginAt2Readable(msTime: number): string {
        let date: Date = new Date(msTime);
        let year: number = date.getFullYear();
        let month: number = date.getMonth() + 1;
        let day: number = date.getDate();

        let hour: number = date.getHours();
        let minute: number = date.getMinutes();
        let second: number = date.getSeconds();

        let fmt: string = `시작일자: ${year}년 ${month}월 ${day}일 `;
        if (hour) fmt += `${hour}시 `;
        if (minute) fmt += `${minute}분 `;
        if (second) fmt += `${second}초`;

        return fmt;
    }

    static until2Readable(msTime: number): string {
        let sTime: number = Math.floor(msTime / 1000);

        let day: number = Math.floor(sTime / 86400);
        let hour: number = Math.floor((sTime - day * 86400) / 3600);
        let minute: number = Math.floor((sTime - day * 86400 - hour * 3600) / 60);
        let second: number = Math.floor((sTime - day * 86400 - hour * 3600 - minute * 60));

        let fmt: string = '남은시간: ';
        if (day != 0) fmt += `${day}일 `;
        if (hour != 0) fmt += `${hour}시간 `;
        if (minute != 0) fmt += `${minute}분 `;
        if (second != 0) fmt += `${second}초 `;

        return fmt;
    }

    static duration2Readable(msTime: number) {
        let sTime: number = Math.floor(msTime / 1000);

        let day: number = Math.floor(sTime / 86400);
        let hour: number = Math.floor((sTime - day * 86400) / 3600);
        let minute: number = Math.floor((sTime - day * 86400 - hour * 3600) / 60);
        let second: number = Math.floor((sTime - day * 86400 - hour * 3600 - minute * 60));

        let fmt: string = '';
        if (day != 0) fmt += `${day}일 `;
        if (hour != 0) fmt += `${hour}시간 `;
        if (minute != 0) fmt += `${minute}분 `;
        if (second != 0) fmt += `${second}초 `;

        return fmt;
    }

    static acmFmt2Iso(acmFmt: string): string {
        let dateItems:string[] = acmFmt.split(" ");

        let year: string, month: string, day: string, hour: string, minute: string, second: string;

        if (dateItems[0]) year = dateItems[0].split("년")[0];
        if (dateItems[1]) month = dateItems[1].split("월")[0];
        if (dateItems[2]) day = dateItems[2].split("일")[0];
        if (dateItems[3]) hour = dateItems[3].split("시")[0];
        if (dateItems[4]) minute = dateItems[4].split("분")[0];
        if (dateItems[5]) second = dateItems[5].split("초")[0];

        let isoFmt: string;
        if (second) isoFmt = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
        if (minute) isoFmt = `${year}-${month}-${day} ${hour}:${minute}:00`;
        if (hour) isoFmt = `${year}-${month}-${day} ${hour}:00:00`;

        return isoFmt;
    }
}

export default TimeFormatter;