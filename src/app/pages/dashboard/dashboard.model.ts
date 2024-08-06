export interface ChartType {
    series?: any;
    plotOptions?: any;
    stroke?: any;
    dataLabels?: any;
    chart?: any;
    legend?: any;
    colors?: any;
    labels?: any;
    xAxis?: any;
}

export interface Stat {
    title: string;
    icon: string;
    value: string;
}

export interface Chat {
    id?: number;
    name?: string;
    message?: string;
    image?: string;
    time?: string;
    align?: string;
    text?: string;
}

export interface Transaction {
    orderid: string;
    date: string;
    billingname: string;
    total: string;
    paymentstatus: string;
}
export interface Data {
    total_devices: number,
    total_active_devices: number,
    total_amount_transaction: number,
    total_workspaces: number
}