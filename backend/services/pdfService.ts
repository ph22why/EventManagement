import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

class PDFService {
  private static instance: PDFService;

  private constructor() {}

  public static getInstance(): PDFService {
    if (!PDFService.instance) {
      PDFService.instance = new PDFService();
    }
    return PDFService.instance;
  }

  /**
   * Generate a PDF for a pool entry
   * @param entryData The entry data to include in the PDF
   * @param outputPath Where to save the PDF
   */
  public async generatePoolEntryPDF(entryData: any, outputPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(outputPath);
        
        doc.pipe(stream);

        // Add title
        doc.fontSize(20).text('Pool Entry Confirmation', { align: 'center' });
        doc.moveDown();

        // Add entry details
        doc.fontSize(12);
        doc.text(`Entry Number: ${entryData.entryNumber}`);
        doc.text(`Pool Name: ${entryData.poolName}`);
        doc.text(`User: ${entryData.userName}`);
        doc.text(`Date Created: ${new Date(entryData.createdAt).toLocaleDateString()}`);
        doc.moveDown();

        // Add picks if available
        if (entryData.picks && entryData.picks.length > 0) {
          doc.fontSize(14).text('Current Picks:');
          entryData.picks.forEach((pick: any, index: number) => {
            doc.fontSize(12).text(`${index + 1}. ${pick.teamName} (${pick.gameDate})`);
          });
        }

        // Finalize the PDF
        doc.end();

        stream.on('finish', () => {
          resolve(outputPath);
        });

        stream.on('error', (error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Generate a PDF for pool standings
   * @param standingsData The standings data to include in the PDF
   * @param outputPath Where to save the PDF
   */
  public async generateStandingsPDF(standingsData: any, outputPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(outputPath);
        
        doc.pipe(stream);

        // Add title
        doc.fontSize(20).text('Pool Standings', { align: 'center' });
        doc.moveDown();

        // Add pool information
        doc.fontSize(14).text(`Pool: ${standingsData.poolName}`);
        doc.text(`Week: ${standingsData.week}`);
        doc.moveDown();

        // Create table for standings
        const tableTop = 200;
        const tableLeft = 50;
        const columnWidth = 150;
        const rowHeight = 30;

        // Table headers
        doc.fontSize(12).font('Helvetica-Bold');
        doc.text('Rank', tableLeft, tableTop);
        doc.text('User', tableLeft + columnWidth, tableTop);
        doc.text('Entry', tableLeft + columnWidth * 2, tableTop);
        doc.text('Score', tableLeft + columnWidth * 3, tableTop);

        // Table rows
        doc.font('Helvetica');
        standingsData.entries.forEach((entry: any, index: number) => {
          const y = tableTop + (index + 1) * rowHeight;
          doc.text((index + 1).toString(), tableLeft, y);
          doc.text(entry.userName, tableLeft + columnWidth, y);
          doc.text(entry.entryNumber.toString(), tableLeft + columnWidth * 2, y);
          doc.text(entry.score.toString(), tableLeft + columnWidth * 3, y);
        });

        // Finalize the PDF
        doc.end();

        stream.on('finish', () => {
          resolve(outputPath);
        });

        stream.on('error', (error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default PDFService; 