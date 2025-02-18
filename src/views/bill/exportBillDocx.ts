import {
	Document,
	Packer,
	TextRun,
	Paragraph,
	Table,
	TableCell,
	TableRow,
	WidthType,
	HeightRule,
	VerticalAlign,
	AlignmentType,
	PageOrientation,
	convertInchesToTwip,
} from 'docx';
import { storeToRefs } from 'pinia';
import { useBillStore } from '@/stores/bill';
import { saveAs } from 'file-saver';
import { dayjs, flatten } from '@/utils/tools';
import { PURPOSE, EXPENSES, PAY_METHOD } from '@/assets/data';
import { useBill } from '@/hooks/useBill';

const { formatBillList, filter } = storeToRefs(useBillStore());
const { incomeTotal, payTotal, serviceFeeTotal, platformFeeTotal, balance } = useBill();

const expenses: any = {
	all: {
		text: '收支明细',
	},
	pay: {
		text: '支出明细',
	},
	income: {
		text: '收入明细',
	},
};

export function exportBillDocx() {
	const BillHeaderName = ['日期', '收支类型', '金额', '支付方式', '手续费', '用途', '备注'];
	const payMethodHeaderName = ['总收入', '总支出', '抖音（服务费）', '美团（服务费）', '支付宝（服务费）', '结余'];
	init();
	function init() {
		const billTable = createBillTabel();
		const totalTable = createTotalTable();
		const doc = createDocument([billTable, new Paragraph({ text: '', spacing: { after: 100 } }), totalTable]);
		downLoad(doc);
	}
	// 创建表格表头
	function createTableHeaderRow(headers: string[]) {
		const tableHeader = new TableRow({
			tableHeader: true,
			children: headers.map((n) => {
				return tableCell(n, 20);
			}),
			height: {
				value: 200,
				rule: HeightRule.EXACT,
			},
		});
		return tableHeader;
	}
	// 创建单元格
	function tableCell(text: string, size: number = 18) {
		return new TableCell({
			children: [
				new Paragraph({
					children: [
						new TextRun({
							text,
							size,
						}),
					],
				}),
			],
			verticalAlign: VerticalAlign.CENTER,
			margins: {
				left: 100,
			},
		});
	}
	// 创建文档
	function createDocument(table: Table[]) {
		return new Document({
			sections: [
				{
					children: [
						new Paragraph({
							heading: 'Heading1',
							alignment: AlignmentType.CENTER, // 设置标题居中
							spacing: {
								after: convertInchesToTwip(0.1), // 设置标题下边距为0.2英寸
							},
							children: [
								new TextRun({
									text: `纤指妆容 ${dayjs(filter.value.month).format('YYYY年MM月')} ${expenses[filter.value.expenses].text}`,
									size: 32,
									color: '#333333',
								}),
							],
						}),
						...table,
					],
					properties: {
						page: {
							margin: {
								top: convertInchesToTwip(0.2), // 顶部边距 1 英寸
								right: convertInchesToTwip(0.2), // 右侧边距 1 英寸
								bottom: convertInchesToTwip(0.2), // 底部边距 1 英寸
								left: convertInchesToTwip(0.2), // 左侧边距 1 英寸
							},
						},
					},
				},
			],
		});
	}
	// 创建账单表格
	function createBillTabel() {
		return new Table({
			rows: [
				createTableHeaderRow(BillHeaderName),
				...flatten(formatBillList.value.map((n) => n.list)).map((n) => {
					return new TableRow({
						children: [
							tableCell(dayjs(n.date).format('YYYY-MM-DD')),
							tableCell(EXPENSES.get(n.expenses)?.label || ''),
							tableCell(`￥${n.price}`),
							tableCell(PAY_METHOD.get(n.payMethod)?.label || ''),
							tableCell(`${n.serviceFee}`),
							tableCell(PURPOSE.get(n.purpose)?.label || ''),
							tableCell(n.remarks),
						],
						height: {
							value: 160,
							rule: HeightRule.EXACT,
						},
					});
				}),
			],
			width: {
				size: 100,
				type: WidthType.PERCENTAGE,
			},
			margins: {
				bottom: convertInchesToTwip(0.1),
			},
		});
	}
	// 创建共支付方式表格
	function createTotalTable() {
		return new Table({
			rows: [
				createTableHeaderRow(payMethodHeaderName),
				new TableRow({
					children: [
						tableCell(incomeTotal(filter.value.month)),
						tableCell(payTotal(filter.value.month)),
						tableCell(platformFeeTotal(filter.value.month, 'douyin')),
						tableCell(platformFeeTotal(filter.value.month, 'meituan')),
						tableCell(platformFeeTotal(filter.value.month, 'alipay')),
						tableCell(balance(filter.value.month)),
					],
					height: {
						value: 280,
						rule: HeightRule.EXACT,
					},
				}),
			],
			width: {
				size: 100,
				type: WidthType.PERCENTAGE,
			},
		});
	}
	async function downLoad(doc: Document) {
		const base64string = await Packer.toBase64String(doc);
		const binaryString = atob(base64string);
		const buffer = new Uint8Array(binaryString.length).map((item, index) => binaryString.charCodeAt(index));
		const blob = new Blob([buffer], { type: 'application/octet-stream' });
		// 使用file-saver保存文件
		saveAs(blob, `纤指妆容 ${dayjs(filter.value.month).format('YYYY年MM月')} ${expenses[filter.value.expenses].text}.doc`);
	}
}
