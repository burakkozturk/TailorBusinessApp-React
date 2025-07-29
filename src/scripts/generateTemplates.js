const jsPDF = require('jspdf');
const fs = require('fs');
const path = require('path');

// PDF template'leri oluştur
const generateTemplates = () => {
  const outputDir = path.join(__dirname, '../../public/pdf-patterns');
  
  // Ceket Template
  const jacketDoc = new jsPDF();
  jacketDoc.setFontSize(20);
  jacketDoc.text('CEKET PATTERN ŞABLONU', 20, 30);
  jacketDoc.setFontSize(12);
  jacketDoc.text('Ölçü Alanları:', 20, 60);
  jacketDoc.rect(20, 80, 170, 200);
  jacketDoc.line(20, 130, 190, 130);
  jacketDoc.line(105, 80, 105, 280);
  jacketDoc.setFontSize(10);
  jacketDoc.text('Göğüs: _____ cm', 25, 100);
  jacketDoc.text('Bel: _____ cm', 25, 120);
  jacketDoc.text('Kol: _____ cm', 110, 100);
  jacketDoc.text('Omuz: _____ cm', 110, 120);
  
  const jacketPdf = jacketDoc.output('arraybuffer');
  fs.writeFileSync(path.join(outputDir, 'ceket-pattern.pdf'), Buffer.from(jacketPdf));
  
  // Gömlek Template
  const shirtDoc = new jsPDF();
  shirtDoc.setFontSize(20);
  shirtDoc.text('GÖMLEK PATTERN ŞABLONU', 20, 30);
  shirtDoc.setFontSize(12);
  shirtDoc.text('Ölçü Alanları:', 20, 60);
  shirtDoc.rect(20, 80, 170, 180);
  shirtDoc.line(20, 140, 190, 140);
  shirtDoc.line(105, 80, 105, 260);
  shirtDoc.setFontSize(10);
  shirtDoc.text('Göğüs: _____ cm', 25, 100);
  shirtDoc.text('Yaka: _____ cm', 25, 120);
  shirtDoc.text('Kol: _____ cm', 110, 100);
  shirtDoc.text('Manşet: _____ cm', 110, 120);
  
  const shirtPdf = shirtDoc.output('arraybuffer');
  fs.writeFileSync(path.join(outputDir, 'gomlek-pattern.pdf'), Buffer.from(shirtPdf));
  
  // Pantolon Template
  const pantsDoc = new jsPDF();
  pantsDoc.setFontSize(20);
  pantsDoc.text('PANTOLON PATTERN ŞABLONU', 20, 30);
  pantsDoc.setFontSize(12);
  pantsDoc.text('Ölçü Alanları:', 20, 60);
  pantsDoc.rect(20, 80, 170, 200);
  pantsDoc.line(20, 150, 190, 150);
  pantsDoc.line(105, 80, 105, 280);
  pantsDoc.setFontSize(10);
  pantsDoc.text('Bel: _____ cm', 25, 100);
  pantsDoc.text('Kalça: _____ cm', 25, 120);
  pantsDoc.text('Paça: _____ cm', 110, 100);
  pantsDoc.text('Boy: _____ cm', 110, 120);
  
  const pantsPdf = pantsDoc.output('arraybuffer');
  fs.writeFileSync(path.join(outputDir, 'pantolon-pattern.pdf'), Buffer.from(pantsPdf));
  
  console.log('✅ PDF template\'leri oluşturuldu!');
};

generateTemplates();
