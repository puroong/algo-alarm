export default {
	beginAt2Readable: function (msTime) {
		let date = new Date(msTime);
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		let hour = date.getHours();
		let minute = date.getMinutes();
		let second = date.getSeconds();

		let fmt = `��������: ${year}�� ${month}�� ${day}�� `;
		if (hour) fmt += `${hour}�� `;
		if (minute) fmt += `${minute}�� `;
		if (second) fmt += `${second}��`;

		return fmt;
	},
	until2Readable: function (msTime) {
		let sTime = Math.floor(msTime / 1000);

		let day = Math.floor(sTime / 86400);
		let hour = Math.floor((sTime - day * 86400) / 3600);
		let minute = Math.floor((sTime - day * 86400 - hour * 3600) / 60);
		let second = Math.floor((sTime - day * 86400 - hour * 3600 - minute * 60));

		let fmt = '�����ð�: ';
		if (day != 0) fmt += `${day}�� `;
		if (hour != 0) fmt += `${hour}�ð� `;
		if (minute != 0) fmt += `${minute}�� `;
		if (second != 0) fmt += `${second}�� `;

		return fmt;
	},
	duration2Readable: function (msTime) {
		let sTime = Math.floor(msTime / 1000);

		let day = Math.floor(sTime / 86400);
		let hour = Math.floor((sTime - day * 86400) / 3600);
		let minute = Math.floor((sTime - day * 86400 - hour * 3600) / 60);
		let second = Math.floor((sTime - day * 86400 - hour * 3600 - minute * 60));

		let fmt = '';
		if (day != 0) fmt += `${day}�� `;
		if (hour != 0) fmt += `${hour}�ð� `;
		if (minute != 0) fmt += `${minute}�� `;
		if (second != 0) fmt += `${second}�� `;

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

		if (dateItems[0]) year = dateItems[0].split("��")[0];
		if (dateItems[1]) month = dateItems[1].split("��")[0];
		if (dateItems[2]) day = dateItems[2].split("��")[0];
		if (dateItems[3]) hour = dateItems[3].split("��")[0];
		if (dateItems[4]) minute = dateItems[4].split("��")[0];
		if (dateItems[5]) second = dateItems[5].split("��")[0];

		let isoFmt;
		if (second) isoFmt = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
		if (minute) isoFmt = `${year}-${month}-${day} ${hour}:${minute}:00`;
		if (hour) isoFmt = `${year}-${month}-${day} ${hour}:00:00`;

		return isoFmt;
	}
};