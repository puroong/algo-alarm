export default {
	beginAt2Readable: function (msTime) {
		let date = new Date(msTime);
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		let hour = date.getHours();
		let minute = date.getMinutes();
		let second = date.getSeconds();

		let fmt = `시작일자: ${year}년 ${month}월 ${day}일 `;
		if (hour) fmt += `${hour}시 `;
		if (minute) fmt += `${minute}분 `;
		if (second) fmt += `${second}초`;

		return fmt;
	},
	until2Readable: function (msTime) {
		let sTime = Math.floor(msTime / 1000);

		let day = Math.floor(sTime / 86400);
		let hour = Math.floor((sTime - day * 86400) / 3600);
		let minute = Math.floor((sTime - day * 86400 - hour * 3600) / 60);
		let second = Math.floor((sTime - day * 86400 - hour * 3600 - minute * 60));

		let fmt = '남은시간: ';
		if (day != 0) fmt += `${day}일 `;
		if (hour != 0) fmt += `${hour}시간 `;
		if (minute != 0) fmt += `${minute}분 `;
		if (second != 0) fmt += `${second}초 `;

		return fmt;
	},
	duration2Readable: function (msTime) {
		let sTime = Math.floor(msTime / 1000);

		let day = Math.floor(sTime / 86400);
		let hour = Math.floor((sTime - day * 86400) / 3600);
		let minute = Math.floor((sTime - day * 86400 - hour * 3600) / 60);
		let second = Math.floor((sTime - day * 86400 - hour * 3600 - minute * 60));

		let fmt = '';
		if (day != 0) fmt += `${day}일 `;
		if (hour != 0) fmt += `${hour}시간 `;
		if (minute != 0) fmt += `${minute}분 `;
		if (second != 0) fmt += `${second}초 `;

		return fmt;
	},
	acmFmt2Iso: function (acmFmt) {
		let dateItems = acmFmt.split(" ");

		let year = undefined;
		let month = undefined;
		let day = undefined;
		let hour = undefined;
		let minute = undefined;
		let second = undefined;

		if (dateItems[0]) year = dateItems[0].split("년")[0];
		if (dateItems[1]) month = dateItems[1].split("월")[0];
		if (dateItems[2]) day = dateItems[2].split("일")[0];
		if (dateItems[3]) hour = dateItems[3].split("시")[0];
		if (dateItems[4]) minute = dateItems[4].split("분")[0];
		if (dateItems[5]) second = dateItems[5].split("초")[0];

		let isoFmt;
		if (second) isoFmt = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
		if (minute) isoFmt = `${year}-${month}-${day} ${hour}:${minute}:00`;
		if (hour) isoFmt = `${year}-${month}-${day} ${hour}:00:00`;

		return isoFmt;
	}
};