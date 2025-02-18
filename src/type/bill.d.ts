interface IBillState {
	showPopup: boolean;
	showKeyboard: boolean;
	showPicker: boolean;
	data: IOrder;
}

interface StoreState {
	billList: IOrder[];
	defaultBillItemData: IOrder;
	filter: {
		month: string;
		expenses: EXPENSE_TYPE;
	};
}

interface FormatBillItem {
	list: IOrder[];
	totalIncome: number;
	totalPay: number;
	totalServiceFee: number;
	date: string;
}
interface Test {}
