/**
 * 时间工具类
 */
export default class TimeUtils {
	/**
	 * 根据时间戳获取日期字符串
	 * 1:tag为空时->xx年xx月xx日
	 * 2:tag假设为- xx-xx-xx
	 * @param  {number} t
	 * @param  {string=null} tag
	 * @returns string
	 */
	public static getYMD(t: number, tag: string = null): string {
		var str: string = "";
		var date: Date = new Date(t);
		var y: number = date.getFullYear();
		var m: number = date.getMonth() + 1;
		var d: number = date.getDate();
		if (tag == null) {
			return y + "年" + m + "月" + d + "日";
		}
		else {
			return [y, m, d].join(tag);
		}
	}

	public static PrefixZero(num, n) {
		return (Array(n).join("0") + num).slice(-n);
	}

	/**
	 * 根据时间戳获取日期字符串，返回一个补0的字符串，比如“20210401”;“20211205”
	 * @param t 
	 * @returns 
	 */
	public static getYMD_fixZero(t: number): string {
		var str: string = "";
		var date: Date = new Date(t);
		var y: number = date.getFullYear();
		var m: number = date.getMonth() + 1;
		var d: number = date.getDate();
		var ms = TimeUtils.PrefixZero(m, 2);
		var ds = TimeUtils.PrefixZero(d, 2);
		return [y, ms, ds].join("");
	}

	/**
	 * 根据时间戳获取日期字符串
	 * 1:tag为空时->xx年xx月xx日
	 * 2:tag假设为- xx-xx-xx
	 * @param  {number} t
	 * @param  {string=null} tag
	 * @returns string
	 */
	public static getYYMMDD(t: number, tag?: string): string {
		var date: Date = new Date(t);
		var y: number = date.getFullYear();
		var m: number = date.getMonth() + 1;
		let strm: string = m + '';
		if (m < 10) {
			strm = '0' + m;
		}
		var d: number = date.getDate();
		let strd: string = d + '';
		if (d < 10) {
			strd = '0' + d;
		}
		if (tag == null) {
			return y + "年" + strm + "月" + strd + "日";
		}
		else {
			return [y, strm, strd].join(tag);
		}
	}

	/**
	 * 获取年月日小时分钟秒
	 * 20160803090501
	 * @param timer 
	 */
	public static getYMDHHMS(timer: number, tag1: string = "", tagmiddle: string = "", tag2: string = ""): string {
		//转换为东八区时间
		// timer += 8 * 60 * 60 * 1000
		var date: Date = new Date(timer);
		var y: number = date.getFullYear();
		var m: string = TimeUtils.fix0(date.getMonth() + 1);
		var d: string = TimeUtils.fix0(date.getDate());
		var ss: string = TimeUtils.fix0(date.getSeconds());
		var mm: string = TimeUtils.fix0(date.getMinutes());
		var hh: string = TimeUtils.fix0(date.getHours());
		return y + tag1 + m + tag1 + d + tagmiddle + hh + tag2 + mm + tag2 + ss;
	}

	/**
	 * 根据时间戳返回时间格式字符串
	 * 1:tag为空时->xx年xx月xx日
	 * 2:tag假设为- xx-xx-xx
	 * @param timer 
	 */
	public static getHHMMSS(timer: number, tag?: string): string {
		var str: string = "";
		var ss: number = Math.floor(timer / 1000);
		var mm: number = Math.floor(ss / 60);
		var hh: number = Math.floor(mm / 60);

		var vs: number = ss % 60;
		var vm: number = mm % 60;
		if (hh > 0) {
			str += hh + (!tag ? "小时" : tag);
		}
		if (vm > 0 || hh > 0) {
			str += vm + (!tag ? "分钟" : tag);
		}
		if (vs >= 0 || hh > 0 || mm > 0) {
			str += vs + (!tag ? "秒" : tag);
		}
		return str;
	}

	/**
	 * 获取时间格式 00:00
	 * @param time 
	 */
	public static getTimeMMSS(time: number): string {
		if (time < 0) time = 0;
		time = Math.ceil(time / 1000);
		let timeShow: string = "";
		let minute: number = Math.floor(time / 60);
		let second: number = time % 60;
		timeShow = this.fix0(minute) + ":" + this.fix0(second);
		return timeShow;
	}

	/**获取时间格式 00:00:00*/
	public static getTimeHHMMSS0(time: number): string {
		let timeShow: string = "";
		var secondTemp: number = Math.ceil(time / 1000);
		var minuteTemp: number = Math.floor(secondTemp / 60);
		var hour: number = Math.floor(minuteTemp / 60);

		var minute = minuteTemp % 60;
		var second = secondTemp % 60;
		timeShow = (hour >= 10 ? hour + "" : "0" + hour) + ":" + (minute >= 10 ? minute + "" : "0" + minute) + ":" + (second >= 10 ? second + "" : "0" + second);
		return timeShow;
	}

	/**
	 * 转换时间格式 00：00  小时和分钟
	 * @param time 
	 * @returns 
	 */
	public static getTimeHHMM(time: number): string {
		let timeShow: string = "";
		var secondTemp: number = Math.ceil(time / 1000);
		var minuteTemp: number = Math.floor(secondTemp / 60);
		var hour: number = Math.floor(minuteTemp / 60);

		var minute = minuteTemp % 60;
		timeShow = (hour >= 10 ? hour + "" : "0" + hour) + ":" + (minute >= 10 ? minute + "" : "0" + minute);
		return timeShow;
	}

	/**
	 * 判断是否相同天,0点对比
	 * @param t1 时间戳
	 * @param t2 时间戳
	 */
	public static IsSameDay(t1: number, t2: number): boolean {
		if (!t1 || !t2) {
			return false;
		}
		var date1: Date = new Date(t1);
		var y1: number = date1.getFullYear();
		var m1: number = date1.getMonth() + 1;
		var d1: number = date1.getDate();

		var date2: Date = new Date(t2);
		var y2: number = date2.getFullYear();
		var m2: number = date2.getMonth() + 1;
		var d2: number = date2.getDate();

		if (y1 == y2 && m1 == m2 && d1 == d2) {
			return true;
		}
		return false;
	}

	/** 
	 * 判断两个时间点是否间隔目标天数，且落在24点之前
	 */
	public static IsSameDayByDay(t1: number, t2: number, day: number): boolean {
		let d1: number = Math.floor(t1 / (1000 * 60 * 60 * 24));
		let d2: number = Math.floor(t2 / (1000 * 60 * 60 * 24));
		return Math.abs(d2 - d1) == day;
	}

	/**
	 * 根据参照点判断两天是否相等
	 * @param  {number} start 参照时间点,比如xx天上午4点整的时间戳
	 * @param  {number} day1 时间戳
	 * @param  {number} day2 时间戳
	 */
	public static IsSameDayByStart(start: number, day1: number, day2: number): boolean {
		let d1: number = Math.floor((day1 - start) / (1000 * 60 * 60 * 24));
		let d2: number = Math.floor((day2 - start) / (1000 * 60 * 60 * 24));
		return d1 == d2;
	}

	/**
	 * 判断是否同一周,周一0点分割
	 * @param old 
	 * @param now 
	 */
	public static isSameWeek(old: number, now: number): boolean {
		let old_f = new Date(old).setHours(0, 0, 0, 0);
		let now_f = new Date(now).setHours(0, 0, 0, 0);
		let oneDayTime = 1000 * 60 * 60 * 24;
		let old_count: number = Math.floor(old_f / oneDayTime);
		let now_other: number = Math.floor(now_f / oneDayTime);
		return Math.floor((old_count + 4) / 7) == Math.floor((now_other + 4) / 7);
	}

	/**
	 * 获取以周为单位的id
	 * @param now 
	 */
	public static getWeekId(now: number): number {
		let now_f = new Date(now).setHours(0, 0, 0, 0);
		let oneDayTime = 1000 * 60 * 60 * 24;
		let now_other: number = Math.floor(now_f / oneDayTime);
		return Math.floor((now_other + 4) / 7);
	}

	/**
	 * 获取某月有多少天
	 * @param  {any} year
	 * @param  {any} month
	 */
	public static getMonthTotalDay(year, month) {
		var d = new Date(year, month, 0);
		return d.getDate();
	}

	/**
	 * 返回某月1日到月底的时间文本
	 * 例子说明一切: 2018年5月1日-2018年5月31日
	 * @param  {number} t
	 * @returns string
	 */
	public static getMonthRangeStr(t: number): string {
		var str: string = "";
		var date: Date = new Date(t);
		var y: number = date.getFullYear();
		var m: number = date.getMonth() + 1;
		var totalday: number = TimeUtils.getMonthTotalDay(y, m);
		return y + "年" + m + "月" + "1日-" + y + "年" + m + "月" + totalday + "日";
	}

	/**
	 * 检查now时间戳是否在mon时间戳的所在月
	 * @param  {number} now 检测时间
	 * @param  {number} mon 化身为月的时间
	 * @returns string
	 */
	public static checkInMonth(now: number, mon: number): boolean {
		var date1: Date = new Date(mon);
		var date2: Date = new Date(now);
		if (date1.getFullYear() === date2.getFullYear() && date1.getMonth() == date2.getMonth()) {
			return true;
		}
		return false;
	}

	/**
	 * 判断是否同一小时
	 * @param  {number} t1
	 * @param  {number} t2
	 * @returns boolean
	 */
	public static CheckSameHours(t1: number, t2: number): boolean {
		var date1: Date = new Date(t1);
		var date2: Date = new Date(t2);
		if (date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate() &&
			date1.getHours() === date2.getHours()) {
			return true;
		}
		return false;
	}

	/**
	 * 根据两个时间点差值获取间隔天数,同一天返回0
	 * @param t1 
	 * @param t2 
	 */
	public static GetDayCntFromTime2(t1: number, t2: number): number {
		let dec: number = Math.abs(t1 - t2);
		let daydec: number = dec / (24 * 60 * 60 * 1000);
		let day: number = Math.floor(daydec);
		return day;
	}

	/**
 * 根据两个时间点差值获取间隔天数,同一天返回0  0点跨天
 * @param lowTime 
 * @param hightTime 
 */
	public static GetDayCntWith0FromTime(lowTime: number, hightTime: number): number {
		let dec: number = hightTime - lowTime;
		let daydec: number = dec / (24 * 60 * 60 * 1000);
		let day: number = Math.floor(daydec);
		let offTime = dec - day * (24 * 60 * 60 * 1000);
		let is = this.IsSameDay(lowTime, offTime + lowTime);
		return is ? day : day + 1;
	}

	/**
	 * 个位数补零
	 * @param n 
	 */
	public static fix0(n: number): string {
		if (n < 10) {
			return "0" + n;
		}
		return "" + n;
	}

	/**获得 x天x小时 */
	public static getDH(time: number) {
		let oneDay = 24 * 60 * 60 * 1000;
		let day = Math.floor(time / oneDay);
		let h = Math.floor((time - oneDay * day) / (60 * 60 * 1000));
		return day + "天" + h + "小时";
	}

	/**获得 x天x小时x分x秒 */
	public static getDHMS(time: number) {
		let s: number = time > 0 ? Math.floor(time / 1000) : 0;
		let m: number = Math.floor(s / 60);
		let h: number = Math.floor(m / 60);
		let d = Math.floor(h / 24);

		let vs: number = s % 60;
		let vm: number = m % 60;
		let vh: number = h % 24;
		return d + "天" + vh + "小时" + vm + "分钟" + vs + "秒";
	}

	/**获得 x天x小时x分 */
	public static getDHM(time: number) {
		let s: number = time > 0 ? Math.floor(time / 1000) : 0;
		let m: number = Math.floor(s / 60);
		let h: number = Math.floor(m / 60);
		let d = Math.floor(h / 24);

		let vs: number = s % 60;
		let vm: number = m % 60;
		let vh: number = h % 24;
		return d + "天" + vh + "小时" + vm + "分钟";
	}
}