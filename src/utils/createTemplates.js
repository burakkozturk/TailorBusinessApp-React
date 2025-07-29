import jsPDF from 'jspdf';

// PDF template'leri oluşturmak için yardımcı script
const createTemplates = () => {
  
  // Ceket Pattern Template
  const createJacketTemplate = () => {
    const doc = new jsPDF();
    
    // Başlık
    doc.setFontSize(20);
    doc.text('CEKET PATTERN ŞABLONU', 20, 30);
    
    // Pattern çizgileri ve alanları
    doc.setFontSize(12);
    doc.text('Ölçü Alanları:', 20, 60);
    
    // Basit pattern çizimi
    doc.rect(20, 80, 170, 200); // Ana çerçeve
    doc.line(20, 130, 190, 130); // Yatay çizgi
    doc.line(105, 80, 105, 280); // Dikey çizgi
    
    // Ölçü etiketleri
    doc.setFontSize(10);
    doc.text('Göğüs:', 25, 100);
    doc.text('Bel:', 25, 120);
    doc.text('Kol:', 110, 100);
    doc.text('Omuz:', 110, 120);
    
    return doc;
  };
  
  // Gömlek Pattern Template
  const createShirtTemplate = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('GÖMLEK PATTERN ŞABLONU', 20, 30);
    
    doc.setFontSize(12);
    doc.text('Ölçü Alanları:', 20, 60);
    
    // Pattern çizimi
    doc.rect(20, 80, 170, 180);
    doc.line(20, 140, 190, 140);
    doc.line(105, 80, 105, 260);
    
    doc.setFontSize(10);
    doc.text('Göğüs:', 25, 100);
    doc.text('Yaka:', 25, 120);
    doc.text('Kol:', 110, 100);
    doc.text('Manşet:', 110, 120);
    
    return doc;
  };
  
  // Pantolon Pattern Template
  const createPantsTemplate = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('PANTOLON PATTERN ŞABLONU', 20, 30);
    
    doc.setFontSize(12);
    doc.text('Ölçü Alanları:', 20, 60);
    
    // Pattern çizimi
    doc.rect(20, 80, 170, 200);
    doc.line(20, 150, 190, 150);
    doc.line(105, 80, 105, 280);
    
    doc.setFontSize(10);
    doc.text('Bel:', 25, 100);
    doc.text('Kalça:', 25, 120);
    doc.text('Paça:', 110, 100);
    doc.text('Boy:', 110, 120);
    
    return doc;
  };
  
  return {
    jacket: createJacketTemplate(),
    shirt: createShirtTemplate(),
    pants: createPantsTemplate()
  };
};

export default createTemplates;
