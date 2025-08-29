import jsPDF from 'jspdf';

// Basit PDF template'leri oluştur ve kaydet
export const createAndSaveTemplates = async () => {
  try {
    // Ceket Template
    const jacketDoc = new jsPDF();
    jacketDoc.setFontSize(20);
    jacketDoc.text('CEKET PATTERN ŞABLONU', 20, 30);
    jacketDoc.setFontSize(12);
    jacketDoc.text('Erdal Güda profesyonel ceket pattern şablonu.', 20, 60);
    jacketDoc.rect(20, 80, 170, 200);
    jacketDoc.setFontSize(10);
    jacketDoc.text('Ölçü alanları burada gösterilecek', 25, 100);
    
    const jacketBlob = new Blob([jacketDoc.output('arraybuffer')], { type: 'application/pdf' });
    
    // Gömlek Template
    const shirtDoc = new jsPDF();
    shirtDoc.setFontSize(20);
    shirtDoc.text('GÖMLEK PATTERN ŞABLONU', 20, 30);
    shirtDoc.setFontSize(12);
    shirtDoc.text('Erdal Güda profesyonel gömlek pattern şablonu.', 20, 60);
    shirtDoc.rect(20, 80, 170, 180);
    shirtDoc.setFontSize(10);
    shirtDoc.text('Ölçü alanları burada gösterilecek', 25, 100);
    
    const shirtBlob = new Blob([shirtDoc.output('arraybuffer')], { type: 'application/pdf' });
    
    // Pantolon Template
    const pantsDoc = new jsPDF();
    pantsDoc.setFontSize(20);
    pantsDoc.text('PANTOLON PATTERN ŞABLONU', 20, 30);
    pantsDoc.setFontSize(12);
    pantsDoc.text('Erdal Güda profesyonel pantolon pattern şablonu.', 20, 60);
    pantsDoc.rect(20, 80, 170, 200);
    shirtDoc.setFontSize(10);
    pantsDoc.text('Ölçü alanları burada gösterilecek', 25, 100);
    
    const pantsBlob = new Blob([pantsDoc.output('arraybuffer')], { type: 'application/pdf' });
    
    console.log('✅ Template PDF\'leri oluşturuldu');
    
    return {
      jacket: jacketBlob,
      shirt: shirtBlob,
      pants: pantsBlob
    };
    
  } catch (error) {
    console.error('❌ Template oluşturma hatası:', error);
    throw error;
  }
};

// Template'leri indir
export const downloadTemplates = async () => {
  const templates = await createAndSaveTemplates();
  
  // Her template'i indir
  Object.entries(templates).forEach(([name, blob]) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}-pattern.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
};
