"use client"
import { useState, useRef } from 'react'
import InvoiceForm from './InvoiceForm';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Invoice from './Invoice';
import { Button } from '@/components/ui/button';

export default function InvoicePage() {
    const [invoiceData, setInvoiceData] = useState<any>(null);
    const invoiceRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState<any>(null);

    const generatePDF = async () => {
        if (!invoiceRef.current) return;

        const canvas = await html2canvas(invoiceRef.current, {
            scale: 2,
            logging: false,
            useCORS: true,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('invoice.pdf');
    };


    const handleFormSubmit = (data: any) => {
        setInvoiceData(data);
        setFormData(data)
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
                    <Button
                        onClick={generatePDF}
                        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Download PDF
                    </Button>
                    <button
                        onClick={() => {
                            setFormData(invoiceData)
                            setInvoiceData(null)
                        }}
                        className="mb-4 ml-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        Edit Invoice
                    </button>
                    <div ref={invoiceRef}>
                        <Invoice {...invoiceData} />
                    </div>
                </div>
            )}
        </div>
    );
}
