import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { currencies } from '@/lib/currencies';

// Replicate Tailwind styles using PDF renderer's style system
const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 12,
    lineHeight: 1.5,
    width: '210mm',
    minHeight: '297mm',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 32,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  logo: {
    width: 128,
    height: 128,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 32,
  },
  table: {
    width: '100%',
    marginBottom: 32,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  colProduct: { width: '40%' },
  colQuantity: { width: '15%', textAlign: 'right' },
  colUnitPrice: { width: '15%', textAlign: 'right' },
  colTax: { width: '15%', textAlign: 'right' },
  colTotal: { width: '15%', textAlign: 'right' },
  totalBox: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 4,
    width: 256,
    marginLeft: 'auto',
  },
  bold: {
    fontWeight: 'bold',
  },
  textXl: {
    fontSize: 20,
  },
  text2xl: {
    fontSize: 24,
  },
  textGray600: {
    color: '#4b5563',
  },
});

const PDFInvoice = ({ invoiceData }: { invoiceData: any }) => {
  const currencyInfo = currencies[invoiceData.currency] || JSON.parse(localStorage.getItem('customCurrencies') || '{}');
  const symbol = currencyInfo?.symbolNative || currencyInfo?.symbol || '$';

  const formatCurrency = (amount: number) => 
    amount.toFixed(currencyInfo?.decimalDigits ?? 2);

  const calculateSubtotal = () =>
    invoiceData.items.reduce((sum: number, item: any) => 
      sum + (item.quantity * item.unitPrice), 0);

  const calculateTotalTax = () =>
    invoiceData.items.reduce((sum: number, item: any) => {
      const itemTax = item.taxType === 'percentage'
        ? (item.quantity * item.unitPrice) * (item.tax / 100)
        : item.tax;
      return sum + itemTax;
    }, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.card}>
          <View style={styles.headerContainer}>
            <View>
              {invoiceData.from.logo && (
                <Image style={styles.logo} src={invoiceData.from.logo} />
              )}
              <View>
                <Text style={[styles.bold, styles.text2xl]}>{invoiceData.from.company}</Text>
                {invoiceData.from.address.map((line: string, i: number) => (
                  <Text key={i} style={styles.textGray600}>{line}</Text>
                ))}
                <Text style={styles.textGray600}>{invoiceData.from.email}</Text>
                <Text style={styles.textGray600}>{invoiceData.from.phone}</Text>
                <Text style={styles.textGray600}>{invoiceData.from.website}</Text>
              </View>
            </View>

            <View>
              <Text style={[styles.bold, styles.text2xl, { marginBottom: 8 }]}>
                Invoice: {invoiceData.invoiceNumber}
              </Text>
              <Text style={styles.textGray600}>Issued on: {invoiceData.issueDate}</Text>
              <Text style={styles.textGray600}>Due by: {invoiceData.dueDate}</Text>
              <Text style={styles.textGray600}>Currency: {currencyInfo.name || invoiceData.currency}</Text>
            </View>
          </View>

          <View style={styles.grid}>
            <View style={{ width: '50%' }}>
              <Text style={[styles.bold, { marginBottom: 8 }]}>From</Text>
              <Text style={styles.textGray600}>{invoiceData.from.company}</Text>
              {invoiceData.from.address.map((line: string, i: number) => (
                <Text key={i} style={styles.textGray600}>{line}</Text>
              ))}
            </View>

            <View style={{ width: '50%' }}>
              <Text style={[styles.bold, { marginBottom: 8 }]}>To</Text>
              <Text style={styles.textGray600}>{invoiceData.to.company}</Text>
              <Text style={styles.textGray600}>{invoiceData.to.contactPerson}</Text>
              {invoiceData.to.address.map((line: string, i: number) => (
                <Text key={i} style={styles.textGray600}>{line}</Text>
              ))}
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.colProduct}>Product</Text>
              <Text style={styles.colQuantity}>Quantity</Text>
              <Text style={styles.colUnitPrice}>Unit Price</Text>
              <Text style={styles.colTax}>Tax</Text>
              <Text style={styles.colTotal}>Total</Text>
            </View>

            {invoiceData.items.map((item: any, index: number) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.colProduct}>{item.product}</Text>
                <Text style={styles.colQuantity}>{item.quantity}</Text>
                <Text style={styles.colUnitPrice}>
                  {symbol}
                  {formatCurrency(item.unitPrice)}
                </Text>
                <Text style={styles.colTax}>
                  {item.taxType === 'percentage'
                    ? `${item.tax}%`
                    : `${symbol}${formatCurrency(item.tax)}`}
                </Text>
                <Text style={styles.colTotal}>
                  {symbol}
                  {formatCurrency(item.total)}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.totalBox}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text>Subtotal:</Text>
              <Text>
                {symbol}
                {formatCurrency(calculateSubtotal())}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text>Tax:</Text>
              <Text>
                {symbol}
                {formatCurrency(calculateTotalTax())}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', fontWeight: 'bold' }}>
              <Text>Total:</Text>
              <Text>
                {symbol}
                {formatCurrency(calculateSubtotal() + calculateTotalTax())}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PDFInvoice;