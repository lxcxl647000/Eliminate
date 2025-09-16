/**
 * 数学工具类
 */
export default class MathUtils {
	/**
	 * 从两个数字之间随机取一个浮点数
	 * @param low 小值
	 * @param high 大值,不填就是0~小值
	 */
	public static randomBetween(low: number, high?: number): number {
		if (!high && high != 0) {
			high = low;
			low = 0;
		}
		let ran: number = low + Math.random() * (high - low);
		return ran;
	}

	/**
	 * 从两个数字之间随机取一个整数
	 * @param low 小值
	 * @param high 大值,不填就是0~小值
	 */
	static randomBetween_Int(min: number, max: number): number {
		let n: number = MathUtils.randomBetween(min, max);
		return Math.floor(n);
	}

	/**
	 * 随机打乱数组
	 * @param list 
	 */
	public static randomSort(list: any[]) {
		if (list == null) {
			return null;
		}
		list.sort((a: any, b: any): number => {
			return 0.5 - Math.random();
		})
		return list;
	}

	/**
	 * 从数组中随机取出一个值
	 * @param list 
	 */
	public static getRDFromList(list: any[]): any {
		let len: number = list.length;
		let id: number = Math.floor(Math.random() * len);
		return list[id];
	}

	/**
	 * 从数组中随机取出N个值，N不能大于数据长度
	 * @param list 
	 * @param num 
	 */
	public static getRDListFromList(list: any[], num: number): any[] | null {
		if (list == null) {
			return null;
		}
		if (num > list.length) {
			num = list.length;
		}
		let tempList: any[] = [];
		list.forEach((val, index, list) => {
			tempList.push(val);
		});
		MathUtils.randomSort(tempList);

		let reList: any[] = [];
		for (let i = 0; i < num; ++i) {
			reList.push(tempList[i]);
		}
		return reList;
	}

	/**
	 * 检查数组中有没有指定的item，
	 * 	如果有，则将其从数组中删除，并返回true；否则返回false
	 * @param list 
	 * @param item 
	 */
	public static spliceOneItemFromList(list: any[], item: any): boolean {
		if (!list || list.length === 0) {
			return false;
		}
		for (let i = list.length - 1; i >= 0; i--) {
			if (list[i] === item) {
				list.splice(i, 1);
				return true;
			}
		}
		return false;
	}

	/**
	 * 权重随机取一个值
	 * @param str 根据冒号后的值计算权重 @example a:30,b:50,c:70,d:100
	 * @returns string
	 */
	public static getRDFromStr_1(str: string): any {
		let slist: string[] = str.split(",");
		let vlist: { key: string, value: number }[] = [];

		for (var i: number = 0; i < slist.length; i++) {
			let vstr: string = slist[i];
			let varr: string[] = vstr.split(":");
			let v: number = +varr[1];
			if (isNaN(v)) v = 0;
			let kv: any = { value: varr[0], prob: v };
			vlist.push(kv);
		}
		return this.getRDFromProbList(vlist);
	}

	/**
	 * 根据权重随机取一个值(圆桌算法)
	 * @param list 取值数组,必须是包括值和概率的any类型数组,@example:[{value:v1,prob:100},{value:v2,prob:900}];
	 * @param valuekey 值key,单条数据中的值key
	 * @param probkey 概率key,单条数据中的概率key
	 */
	public static getRDFromProbList(list: any[], valuekey: string = "value", probkey: string = "prob"): any {
		if (list == null || list.length < 1) {
			console.warn("MathUtils::getRDFromProbList->数组随机错误,数组没有数据");
			return null;
		}
		if (list.length == 1) {
			return list[0][valuekey];
		}
		let max: number = 0;
		for (let i of list) {
			let p: number = i[probkey] != null ? +i[probkey] : 0;
			max += p;
		}
		let r: number = Math.random() * max;
		let last: number = 0;
		for (let i: number = 0; i < list.length; i++) {
			if (r >= last && r < (last + list[i][probkey])) {
				return list[i][valuekey];
			}
			last += list[i][probkey];
		}
		if (list[0] && list[0][valuekey]) {
			return list[0][valuekey]
		}
		return null;
	}

	private static comp: number = 0;
	private static company = ["", "万", "亿", "兆", "aa", "ab", "ac", "ad", "ae", "af", "ag", "ah", "ai", "aj", "ak", "al", "am", "an", "ao", "ap", "aq", "ar", "as", "at", "au", "av", "aw", "ax", "ay", "az"];

	/**带单位的数字 */
	public static changeCompanyNumber(num: number): string {
		if (!num) return "0";
		// cc.log("ssssssssssssssssssssss", num);
		this.comp = 0;
		num = Math.floor(num);
		let size: number = this.getSize(num);
		let returnstr: string = "";

		returnstr = size.toFixed(2);

		// if (returnstr.endsWith("0")) {
		// 	returnstr = Math.floor(size) + this.company[this.comp];
		// }
		// else {
		if (num <= 10000) {
			returnstr = num + "";

		}
		else {
			returnstr = size.toFixed(2) + this.company[this.comp];
		}
		// }

		return returnstr;
	}

	/**
	 * 转换Size为带单位的值  保留所有小数
	 * @param long 
	 */
	public static getSize(size: number): number {
		var num = 10000.00; //byte
		if (size < num)
			return size;
		this.comp = 0;
		while (size >= num) {
			size /= num;
			++this.comp;
		}
		return size;
	}

	/**
	 * 根据权重的数组算出随机数(返回算出的结果是数组的索引) 
	 */
	public static GetRandomIndexByWeight(weightarr: Array<number>): number {
		let result: number = 0;
		let allnum: number = 0;//权重总和
		for (var num of weightarr) {
			allnum += num;
		}
		//根据权重生成产物
		let ran: number = Math.random() * allnum;
		for (let i in weightarr) {
			if (ran <= weightarr[Number(i + "")]) {//符合条件
				result = Number(i + "");
				break;
			}
			else {
				ran -= weightarr[Number(i + "")];
			}
		}
		return result;
	}

	/**
	 * @description 提供一个权重数组 返回一个权重后的值 格式[[value,weight]]
	 * @static
	 * @param {Array<number>} weightArr
	 * @returns {number}
	 */
	public static weightByArray(weightArr: Array<number>): number | null {
		let total = 0;
		weightArr.forEach(data => {
			total += data[1];
		});

		let random = Math.random() * total;
		let weightTotal = 0;
		for (let index = 0; index < weightArr.length; index++) {
			let data = weightArr[index];
			weightTotal += data[1];
			if (weightTotal >= random) {
				return data[0];
			}
		}

		return null;
	}

	/**
	* 点与直线的交点
	* @param p1 直线上的点
	* @param p2 直线上的点
	* @param p3 直线外的点
	*/
	public static getIntersection(p1: any, p2: any, p3: any) {
		var point: any = {};
		//如果p1.x==p2.x 说明是条竖着的线
		if (p1.x - p2.x == 0) {
			point.x = p1.x;
			point.y = p3.y;
		} else {
			var A = (p1.y - p2.y) / (p1.x - p2.x);
			var B = p1.y - A * p1.x;
			var m = p3.x + A * p3.y;
			point.x = (m - A * B) / (A * A + 1);
			point.y = A * point.x + B;
		}
		return point;
	}

	/**
	 * 点到直线的距离
	 */
	public static getDisFromPointToLine(p1: any, p2: any, p3: any): number {
		var len: number;
		//如果p1.x==p2.x 说明是条竖着的线
		if (p1.x - p2.x == 0) {
			len = Math.abs(p3.x - p1.x);
		} else {
			var A = (p1.y - p2.y) / (p1.x - p2.x);
			var B = p1.y - A * p1.x;
			len = Math.abs((A * p3.x + B - p3.y) / Math.sqrt(A * A + 1));
		}
		return len;
	}

	public static getDisFromPointToPoint(p1: any, p2: any): number {
		return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
	}

	/**
	 * 判断点在线的左右侧判断方法
	 * key > 0 在左侧
	 * key = 0 在线上
	 * key < 0 在右侧
	 */
	public static isOnline(p1: any, p2: any, p3: any): number {
		var key = (p1.y - p2.y) * p3.x + (p2.x - p1.x) * p3.y + p1.x * p2.y - p2.x * p1.y;
		return key;
	}

	public static generateUUID() {
		let lut = [];
		for (let i = 0; i < 256; i++) {
			lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
		}
		let d0 = Math.random() * 0xffffffff | 0;
		let d1 = Math.random() * 0xffffffff | 0;
		let d2 = Math.random() * 0xffffffff | 0;
		let d3 = Math.random() * 0xffffffff | 0;

		return lut[d0 & 0xff] + [d0 >> 8 & 0xff] + [d0 >> 16 & 0xff] + [d0 >> 24 & 0xff] + '-' +
			lut[d1 & 0xff] + [d1 >> 8 & 0xff] + [d1 >> 16 & 0x0f | 0x40] + [d1 >> 24 & 0xff] + '-' +
			lut[d2 & 0x3f | 0x80] + [d2 >> 8 & 0xff] + [d2 >> 16 & 0xff] + [d2 >> 24 & 0xff] + '-' +
			lut[d3 & 0xff] + [d3 >> 8 & 0xff] + [d3 >> 16 & 0xff] + [d3 >> 24 & 0xff];
	}
}