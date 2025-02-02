import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { currencies } from '@/lib/currencies';

interface InvoiceItem {
    product: string;
    quantity: number;
    unitPrice: number;
    tax: number;
    taxType: 'percentage' | 'fixed';
    total: number;
}

interface InvoiceProps {
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    currency: string;
    from: {
        company: string;
        logo?: string;
        address: string[];
        email: string;
        phone: string;
        website: string;
    };
    to: {
        company: string;
        contactPerson: string;
        address: string[];
        email: string;
        phone: string;
    };
    items: InvoiceItem[];
}

function Invoice({
    invoiceNumber,
    issueDate,
    dueDate,
    currency,
    from,
    to,
    items,
}: InvoiceProps) {
    const getCustomCurrencies = () => {
        try {
            const stored = localStorage.getItem('customCurrencies');
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error('Failed to parse custom currencies:', e);
            return {};
        }
    };

    const customCurrencies = getCustomCurrencies();
    const currencyInfo = currencies[currency] || customCurrencies[currency];
    const symbol = currencyInfo?.symbolNative || currencyInfo?.symbol || '$'

    const formatCurrency = (amount: number) => {
        return amount.toFixed(currencyInfo?.decimalDigits ?? 2);
    };

    const calculateSubtotal = () => {
        return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    };

    const calculateTotalTax = () => {
        return items.reduce((sum, item) => {
            const itemTax = item.taxType === 'percentage' ?
                (item.quantity * item.unitPrice) * (item.tax / 100)
                : item.tax;
            return sum + itemTax
        }, 0);
    };

    return (
        <Card className="w-[210mm] h-[297mm] mx-auto bg-white p-8 shadow-lg">
            <CardContent>
                <div className="flex justify-between items-start mb-8">
                    <div className="flex flex-col space-y-4">
                        {from.logo && (
                            <div className="w-32 h-32">
                                <img
                                    src={from.logo}
                                    alt={`${from.company} logo`}
                                    className="object-contain w-full h-full"
                                />
                            </div>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold">{from.company}</h1>
                            {from.address.map((line, i) => (
                                <p key={i} className="text-gray-600">{line}</p>
                            ))}
                            <p className="text-gray-600">{from.email}</p>
                            <p className="text-gray-600">{from.phone}</p>
                            <p className="text-gray-600">{from.website}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-bold mb-2">Invoice: {invoiceNumber}</h2>
                        <p className="text-gray-600">Issued on: {issueDate}</p>
                        <p className="text-gray-600">Due by: {dueDate}</p>
                        <p className="text-gray-600 mt-2">Currency: {currencyInfo?.name || currency}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">From</h3>
                        <div className="text-gray-600">
                            <p className="font-medium">{from.company}</p>
                            {from.address.map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">To</h3>
                        <div className="text-gray-600">
                            <p className="font-medium">{to.company}</p>
                            <p>{to.contactPerson}</p>
                            {to.address.map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>
                    </div>
                </div>

                <table className="w-full mb-8">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="text-left p-3">Product</th>
                            <th className="text-right p-3">Quantity</th>
                            <th className="text-right p-3">Unit Price</th>
                            <th className="text-right p-3">Tax</th>
                            <th className="text-right p-3">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-3">{item.product}</td>
                                <td className="text-right p-3">{item.quantity}</td>
                                <td className="text-right p-3">{symbol}{formatCurrency(item.unitPrice)}</td>
                                <td className="text-right p-3">{item.taxType === 'percentage'
                                    ? `${item.tax}%`
                                    : `${symbol}${formatCurrency(item.unitPrice)}`}
                                </td>
                                <td className="text-right p-3">{symbol}{formatCurrency(item.total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-end">
                    <div className="w-64">
                        <div className="bg-gray-100 p-4 rounded">
                            <div className="flex justify-between mb-2">
                                <span>Subtotal</span>
                                <span>{symbol}{formatCurrency(calculateSubtotal())}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span>Tax</span>
                                <span>{symbol}{formatCurrency(calculateTotalTax())}</span>
                            </div>
                            <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span>{symbol}{formatCurrency(calculateSubtotal() + calculateTotalTax())}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default Invoice;