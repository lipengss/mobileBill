declare module 'lodash-es';

declare module '@/utils/tools';

type EXPENSE_TYPE = 'income' | 'pay';

interface IOrder {
	date: string;
	expenses: EXPENSE_TYPE;
	price: string;
	serviceFee: number;
	purpose: string;
	payMethod: string;
	remarks: string;
	id: string;
}

interface ISeriesData {
	value: string | number;
	name: string;
}

interface IState {
	search: {
		payMethod: string;
		expenses: string;
		dateType: string;
		date: string;
	};
	dataList: IOrder[];
}

interface IDialogState {
	visible: boolean;
	data: IOrder;
}
