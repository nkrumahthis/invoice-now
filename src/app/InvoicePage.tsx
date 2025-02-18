"use client"
import { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFInvoice from './PDFInvoice';
import InvoiceForm from './InvoiceForm';
import Invoice from './Invoice';
import { Button } from '@/components/ui/button';

export default function InvoicePage() {
    const [invoiceData, setInvoiceData] = useState<any>(null);
    const [formData, setFormData] = useState<any>(null);

    const handleFormSubmit = (data: any) => {
        setInvoiceData(data);
        setFormData(data);
    };

    return (
        <div className="min-h-screen w-full bg-gray-100 py-8 px-4">
            {!invoiceData ? (
                <div className="max-w-6xl mx-auto">
                    <InvoiceForm
                        onSubmit={handleFormSubmit}
                        initialData={formData}
                    />
                </div>
            ) : (
                <div className="max-w-4xl mx-auto">
                    <div className="mb-4 flex gap-4">
                        <PDFDownloadLink
                            document={<PDFInvoice invoiceData={invoiceData} />}
                            fileName="invoice.pdf"
                        >
                            {({ loading }) => (
                                <Button disabled={loading}>
                                    {loading ? 'Generating PDF...' : 'Download PDF'}
                                </Button>
                            )}
                        </PDFDownloadLink>

                        <Button
                            variant="outline"
                            onClick={() => {
                                setFormData(invoiceData);
                                setInvoiceData(null);
                            }}
                        >
                            Edit Invoice
                        </Button>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                        <Invoice {...invoiceData} />
                    </div>
                </div>
            )}
        </div>
    );
}