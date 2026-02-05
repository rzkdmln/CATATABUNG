import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

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

    // Generate base64
    const wbout = XLSX.write(wb, { type: 'base64', bookType: "xlsx" });
    
    // File name
    const fileName = `Laporan_Catatabung_${new Date().getTime()}.xlsx`;
    const filePath = FileSystem.cacheDirectory + fileName;

    // Write file
    await FileSystem.writeAsStringAsync(filePath, wbout, {
      encoding: FileSystem.EncodingType.Base64
    });

    // Share file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'Kirim Laporan Excel',
        UTI: 'com.microsoft.excel.xlsx'
      });
    } else {
      Alert.alert('Error', 'Fitur sharing tidak tersedia di perangkat ini');
    }
  } catch (error) {
    console.error('Export error:', error);
    Alert.alert('Error', 'Gagal membuat laporan Excel');
  }
};
