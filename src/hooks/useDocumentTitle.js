import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
    const baseTitle = 'Erdal Güda - Profesyonel Terzilik Hizmetleri';
    
    if (title) {
      document.title = `${title} | ${baseTitle}`;
    } else {
      document.title = baseTitle;
    }
    
    // Cleanup function - component unmount olduğunda base title'a döner
    return () => {
      document.title = baseTitle;
    };
  }, [title]);
};

export default useDocumentTitle; 