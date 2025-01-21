import React, { useState, useEffect } from 'react';
import LogoUpload from './LogoUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InvoiceFormData {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
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
  items: Array<{
    product: string;
    quantity: number;
    unitPrice: number;
    tax: number;
    total: number;
  }>;
}

interface InvoiceFormProps {
  onSubmit: (data: InvoiceFormData) => void;
}

function InvoiceForm({ onSubmit }: InvoiceFormProps) {
  // Helper function to get today's date in YYYY-MM-DD format
  function getTodayDate() {
    return new Date().toISOString().split('T')[0];
  }

  // Helper function to get date 30 days from today in YYYY-MM-DD format
  function getDueDate() {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  }

  // Helper function to generate invoice number
  function generateInvoiceNumber(companyName: string) {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    
    // Get initials from company name
    const initials = companyName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase() || 'COM';

    return `${initials}-${year}${month}${day}-0001`;
  }

  const [formData, setFormData] = useState<InvoiceFormData>({
    invoiceNumber: generateInvoiceNumber('Company'),
    issueDate: getTodayDate(),
    dueDate: getDueDate(),
    from: {
      company: '',
      address: ['', '', ''],
      email: '',
      phone: '',
      website: ''
    },
    to: {
      company: '',
      contactPerson: '',
      address: ['', '', ''],
      email: '',
      phone: ''
    },
    items: [
      {
        product: '',
        quantity: 0,
        unitPrice: 0,
        tax: 0,
        total: 0
      }
    ]
  });

  // Update invoice number when company name changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      invoiceNumber: generateInvoiceNumber(prev.from.company)
    }));
  }, [formData.from.company]);

  function updateFromField(field: keyof typeof formData.from, value: string) {
    setFormData(prev => ({
      ...prev,
      from: { ...prev.from, [field]: value }
    }));
  }

  function updateFromAddress(index: number, value: string) {
    const newAddress = [...formData.from.address];
    newAddress[index] = value;
    setFormData(prev => ({
      ...prev,
      from: { ...prev.from, address: newAddress }
    }));
  }

  function updateToField(field: keyof typeof formData.to, value: string) {
    setFormData(prev => ({
      ...prev,
      to: { ...prev.to, [field]: value }
    }));
  }

  function updateToAddress(index: number, value: string) {
    const newAddress = [...formData.to.address];
    newAddress[index] = value;
    setFormData(prev => ({
      ...prev,
      to: { ...prev.to, address: newAddress }
    }));
  }

  function updateItem(index: number, field: keyof typeof formData.items[0], value: string | number) {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    
    // Recalculate total
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? Number(value) : newItems[index].quantity;
      const unitPrice = field === 'unitPrice' ? Number(value) : newItems[index].unitPrice;
      newItems[index].total = quantity * unitPrice;
    }
    
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  }

  function addItem() {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        product: '',
        quantity: 0,
        unitPrice: 0,
        tax: 0,
        total: 0
      }]
    }));
  }

  function removeItem(index: number) {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Invoice Number</Label>
              <Input
                value={formData.invoiceNumber}
                onChange={e => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                placeholder="Invoice #"
                disabled
              />
            </div>
            <div>
              <Label>Issue Date</Label>
              <Input
                type="date"
                value={formData.issueDate}
                onChange={e => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
              />
            </div>
            <div>
              <Label>Due Date</Label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={e => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rest of the form components remain the same */}
      <Card>
        <CardHeader>
          <CardTitle>From (Your Details)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label>Company Name</Label>
              <Input
                value={formData.from.company}
                onChange={e => updateFromField('company', e.target.value)}
                placeholder="Your Company"
              />
            </div>
            <LogoUpload
              value={formData.from.logo}
              onChange={(logo) => updateFromField('logo', logo)}
            />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            {formData.from.address.map((line, i) => (
              <Input
                key={i}
                value={line}
                onChange={e => updateFromAddress(i, e.target.value)}
                placeholder={`Address Line ${i + 1}`}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.from.email}
                onChange={e => updateFromField('email', e.target.value)}
                placeholder="your@email.com"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={formData.from.phone}
                onChange={e => updateFromField('phone', e.target.value)}
                placeholder="Phone number"
              />
            </div>
          </div>
          <div>
            <Label>Website</Label>
            <Input
              value={formData.from.website}
              onChange={e => updateFromField('website', e.target.value)}
              placeholder="https://yourwebsite.com"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>To (Client Details)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Company Name</Label>
              <Input
                value={formData.to.company}
                onChange={e => updateToField('company', e.target.value)}
                placeholder="Client Company"
              />
            </div>
            <div>
              <Label>Contact Person</Label>
              <Input
                value={formData.to.contactPerson}
                onChange={e => updateToField('contactPerson', e.target.value)}
                placeholder="Contact Person"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            {formData.to.address.map((line, i) => (
              <Input
                key={i}
                value={line}
                onChange={e => updateToAddress(i, e.target.value)}
                placeholder={`Address Line ${i + 1}`}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.to.email}
                onChange={e => updateToField('email', e.target.value)}
                placeholder="client@email.com"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={formData.to.phone}
                onChange={e => updateToField('phone', e.target.value)}
                placeholder="Phone number"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 items-end border-b pb-4">
              <div className="col-span-4">
                <Label>Product/Service</Label>
                <Input
                  value={item.product}
                  onChange={e => updateItem(index, 'product', e.target.value)}
                  placeholder="Item description"
                />
              </div>
              <div className="col-span-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={e => updateItem(index, 'quantity', Number(e.target.value))}
                  min="0"
                />
              </div>
              <div className="col-span-2">
                <Label>Unit Price</Label>
                <Input
                  type="number"
                  value={item.unitPrice}
                  onChange={e => updateItem(index, 'unitPrice', Number(e.target.value))}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="col-span-2">
                <Label>Tax</Label>
                <Input
                  type="number"
                  value={item.tax}
                  onChange={e => updateItem(index, 'tax', Number(e.target.value))}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="col-span-1">
                <Label>Total</Label>
                <p className="py-2">${item.total.toFixed(2)}</p>
              </div>
              <div className="col-span-1">
                {formData.items.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeItem(index)}
                    className="w-full"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addItem}
            className="w-full"
          >
            Add Item
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Generate Invoice
        </Button>
      </div>
    </form>
  );
}

export default InvoiceForm;