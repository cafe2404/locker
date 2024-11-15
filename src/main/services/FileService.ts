import { dialog } from 'electron'
import * as fs from 'fs'
import Papa from 'papaparse'

export const openCsvFile = async (): Promise<string | null> => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'CSV Files', extensions: ['csv'] }]
  })
  if (canceled || filePaths.length === 0) return null
  return filePaths[0]
}

export const saveCsvFile = async (): Promise<string | null> => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    filters: [{ name: 'CSV Files', extensions: ['csv'] }]
  });
  if (canceled || !filePath) return null;
  return filePath;
}

export const readCsvFile = async (filePath: string): Promise<IPasswordData[]> => {
  const csvData = fs.readFileSync(filePath, 'utf8')
  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      header: true, // Chuyển đổi hàng đầu tiên thành tên cột
      complete: (results) => resolve(results.data),
      error: (error) => reject(error)
    })
  })
}

export const writeCsvFile = async (filePath: string, data: string[][]): Promise<void> => {
  const csvContent = Papa.unparse(data)
  fs.writeFileSync(filePath, csvContent)
}