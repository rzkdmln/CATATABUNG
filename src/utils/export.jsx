import * as XLSX from 'xlsx';
import { Alert, Platform } from 'react-native';

export const exportTransactionsToExcel = async (transactions) => {
  try {
    if (!transactions || transactions.length === 0) {
      Alert.alert('Info', 'Tidak ada transaksi untuk diekspor');
      return;
    }

    // Prepare data for Excel
    const data = transactions.map(t => ({
      Tanggal: new Date(t.date).toLocaleDateString('id-ID'),
      Tipe: t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      Kategori: t.category,
      Jumlah: t.amount,
      Catatan: t.note || '-'
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Transaksi");

    if (Platform.OS === 'web') {
      // Direct download for Web
      XLSX.writeFile(wb, `Laporan_Catatabung_${new Date().getTime()}.xlsx`);
    } else {
      Alert.alert('Error', 'Modul export native telah dihapus. Silakan gunakan versi web.');
    }
  } catch (error) {
    console.error('Export error:', error);
    Alert.alert('Error', 'Gagal membuat laporan Excel');
  }
};
