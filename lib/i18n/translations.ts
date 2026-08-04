export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'pt' | 'it'

export const LANGUAGES: Record<Language, { native: string; flag: string }> = {
  en: { native: 'English',    flag: '🇬🇧' },
  es: { native: 'Español',    flag: '🇪🇸' },
  fr: { native: 'Français',   flag: '🇫🇷' },
  de: { native: 'Deutsch',    flag: '🇩🇪' },
  zh: { native: '中文',        flag: '🇨🇳' },
  ja: { native: '日本語',       flag: '🇯🇵' },
  pt: { native: 'Português',  flag: '🇧🇷' },
  it: { native: 'Italiano',   flag: '🇮🇹' },
}

export interface T {
  nav: {
    about: string; howItWorks: string; features: string; calculator: string
    security: string; vsDocParser: string; faq: string; contact: string
    pricing: string; login: string; getStarted: string; getStartedFree: string
    goToDashboard: string; aboutUs: string; whyDatafyle: string
    fileTypes: string; reviews: string; dataSecurity: string; teams: string
  }
  hero: {
    line1: string; price1: string; line2: string; price2: string
    sub: string; cta: string; ctaDash: string; watchDemo: string; noCreditCard: string
  }
  trust: {
    eyebrow: string; firms: string; firmsSub: string
    docs: string; docsSub: string; rating: string; ratingSub: string
    uptime: string; uptimeSub: string
  }
  comparison: {
    title: string; sub: string
    oldBadge: string; oldTitle: string; newBadge: string; newTitle: string
  }
  howItWorks: {
    title: string; sub: string
    s1: string; s1d: string
    s2: string; s2d: string
    s3: string; s3d: string
  }
  sections: {
    features: string; featuresSub: string
    fileTypes: string; fileTypesSub: string
    reviews: string; reviewsSub: string; reviewsVerified: string; reviewsNote: string
    calculator: string; calculatorSub: string
    security: string; securitySub: string; securityBadge: string
    vsDocParser: string; vsDocParserSub: string
  }
  securityTrust: string[]
  faq: {
    badge: string; title: string; sub: string
    all: string; features: string; pricing: string; security: string; teams: string
    contactText: string; contactBtn: string
  }
  cta: { title: string; sub: string; btn: string; note: string }
  dashboard: {
    morning: string; afternoon: string; evening: string
    totalProcessed: string; thisMonth: string; fieldsExtracted: string; anomalies: string
    uploadBtn: string; uploadTitle: string; uploadSub: string
    exportExcel: string; exportAll: string; exportSelected: string
    myDocuments: string; searchPlaceholder: string
    done: string; processing: string; pending: string; failed: string
    noDocuments: string; noDocumentsSub: string
    downloadExcel: string; viewDetails: string
    dismiss: string; completeUpgrade: string; viewPlans: string
    freePlanMsg: string; freePlanSub: string
    batchUpload: string; singleUpload: string
    copyJSON: string; copied: string
    fileName: string; fileType: string; date: string; status: string; confidence: string; uploadedBy: string
    allFiles: string; filter: string
  }
}

const en: T = {
  nav: {
    about: 'About', howItWorks: 'How It Works', features: 'Features',
    calculator: 'Calculator', security: 'Security', vsDocParser: 'vs DocParser',
    faq: 'FAQ', contact: 'Contact', pricing: 'Pricing', login: 'Login',
    getStarted: 'Get Started', getStartedFree: 'Get Started Free',
    goToDashboard: 'Go to Dashboard', aboutUs: 'About Us',
    whyDatafyle: 'Why Datafyle', fileTypes: 'File Types',
    reviews: 'Reviews', dataSecurity: 'Data Security', teams: 'Teams',
  },
  hero: {
    line1: 'Your bookkeeper costs', price1: '$2,500/month.',
    line2: ' Datafyle costs', price2: '$49.',
    sub: 'Stop wasting hours on manual data entry. Upload any invoice, receipt, or statement — PDF, Word, image, or CSV — and let AI extract every field in under 10 seconds.',
    cta: 'Get Started Free', ctaDash: 'Go to Dashboard',
    watchDemo: 'Watch Demo', noCreditCard: 'No credit card required · Free 10 documents',
  },
  trust: {
    eyebrow: 'Trusted by accounting firms across UK, US & Australia',
    firms: 'Accounting Firms', firmsSub: 'actively using Datafyle',
    docs: 'Documents Processed', docsSub: 'invoices, receipts & more',
    rating: 'Average Rating', ratingSub: 'across Capterra, G2 & Trustpilot',
    uptime: 'Platform Uptime', uptimeSub: 'SLA-backed reliability',
  },
  comparison: {
    title: 'The Old Way vs The Datafyle Way', sub: 'Same documents. Completely different experience.',
    oldBadge: 'Manual Process', oldTitle: 'The Old Way',
    newBadge: 'AI-Powered', newTitle: 'The Datafyle Way',
  },
  howItWorks: {
    title: 'How Datafyle Works', sub: 'From upload to clean Excel in under 10 seconds.',
    s1: 'Upload Your Document', s1d: 'Drop any PDF, Word, Excel, image or CSV — up to 25MB. No templates, no setup.',
    s2: 'AI Extracts Everything', s2d: 'Our AI reads the document and pulls every vendor, amount, date, line item and tax field automatically.',
    s3: 'Download Clean Excel', s3d: 'Get a structured 3-sheet Excel file — Summary, Line Items, Anomalies — ready to import into any accounting software.',
  },
  sections: {
    features: 'Everything Your Accounting Team Needs', featuresSub: 'Not just extraction — a full document intelligence platform.',
    fileTypes: 'Works With Every File Type You Get From Clients', fileTypesSub: 'No conversion, no reformatting, no excuses.',
    reviews: 'Trusted by Accounting Professionals', reviewsSub: 'Real reviews from real accountants and bookkeepers.',
    reviewsVerified: 'Verified', reviewsNote: 'All reviews are from verified customers on third-party platforms. No incentives were offered.',
    calculator: 'See How Much Time & Money You Can Save', calculatorSub: 'Adjust the sliders to match your firm. Numbers update in real time.',
    security: 'Your Financial Data is 100% Safe', securitySub: 'We protect your documents with bank-level security. Every file, every byte — encrypted, isolated, and never shared.',
    securityBadge: 'Enterprise-Grade Security',
    vsDocParser: 'Datafyle vs DocParser', vsDocParserSub: 'Both tools extract data from documents. Here\'s why accountants and bookkeepers choose Datafyle.',
  },
  securityTrust: ['GDPR Compliant', 'UK GDPR Ready', 'AES-256 Encrypted', 'No Data Selling', 'Deletion on Request'],
  faq: {
    badge: 'Got Questions?', title: 'Frequently Asked Questions',
    sub: 'Everything you need to know before switching to Datafyle.',
    all: 'All', features: 'Features', pricing: 'Pricing', security: 'Security', teams: 'Teams',
    contactText: "Still have questions we didn't answer?", contactBtn: 'Contact our team',
  },
  cta: {
    title: 'Stop Wasting 8 Hours a Day on Data Entry',
    sub: 'Join 50+ accounting firms already saving time with Datafyle',
    btn: 'Get Started Now — It\'s Free',
    note: 'No credit card · Free 10 documents · Setup in 3 minutes',
  },
  dashboard: {
    morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening',
    totalProcessed: 'Total Processed', thisMonth: 'This Month',
    fieldsExtracted: 'Fields Extracted', anomalies: 'Anomalies',
    uploadBtn: 'Upload Documents', uploadTitle: 'Drop files here or click to browse',
    uploadSub: 'PDF · Word · Excel · CSV · XML · TXT · Images · Max 25 MB',
    exportExcel: 'Export to Excel', exportAll: 'Export All', exportSelected: 'Export Selected',
    myDocuments: 'My Documents', searchPlaceholder: 'Search by filename or vendor…',
    done: 'Done', processing: 'Processing', pending: 'Pending', failed: 'Failed',
    noDocuments: 'No documents yet', noDocumentsSub: 'Upload your first document above to get started.',
    downloadExcel: 'Download Excel', viewDetails: 'View Details',
    dismiss: 'Dismiss', completeUpgrade: 'Complete Upgrade →', viewPlans: 'View Plans',
    freePlanMsg: 'You\'re on the Free plan', freePlanSub: 'Upgrade to Starter ($49/mo) for 500 docs, anomaly detection, and team features',
    batchUpload: 'Batch Upload', singleUpload: 'Single Upload',
    copyJSON: 'Copy JSON', copied: 'Copied!',
    fileName: 'File Name', fileType: 'Type', date: 'Date', status: 'Status',
    confidence: 'Confidence', uploadedBy: 'Uploaded By', allFiles: 'All Files', filter: 'Filter',
  },
}

const es: T = {
  nav: {
    about: 'Acerca', howItWorks: 'Cómo Funciona', features: 'Características',
    calculator: 'Calculadora', security: 'Seguridad', vsDocParser: 'vs DocParser',
    faq: 'FAQ', contact: 'Contacto', pricing: 'Precios', login: 'Iniciar Sesión',
    getStarted: 'Comenzar', getStartedFree: 'Comenzar Gratis',
    goToDashboard: 'Ir al Panel', aboutUs: 'Sobre Nosotros',
    whyDatafyle: 'Por Qué Datafyle', fileTypes: 'Tipos de Archivo',
    reviews: 'Reseñas', dataSecurity: 'Seguridad de Datos', teams: 'Equipos',
  },
  hero: {
    line1: 'Tu contador cuesta', price1: '$2,500/mes.',
    line2: ' Datafyle cuesta', price2: '$49.',
    sub: 'Deja de perder horas en entrada manual de datos. Sube cualquier factura, recibo o estado — PDF, Word, imagen o CSV — y deja que la IA extraiga cada campo en menos de 10 segundos.',
    cta: 'Empezar Gratis', ctaDash: 'Ir al Panel',
    watchDemo: 'Ver Demo', noCreditCard: 'Sin tarjeta de crédito · 10 documentos gratis',
  },
  trust: {
    eyebrow: 'Con la confianza de firmas contables en UK, EE.UU. y Australia',
    firms: 'Firmas Contables', firmsSub: 'usando Datafyle activamente',
    docs: 'Documentos Procesados', docsSub: 'facturas, recibos y más',
    rating: 'Valoración Media', ratingSub: 'en Capterra, G2 y Trustpilot',
    uptime: 'Disponibilidad', uptimeSub: 'fiabilidad garantizada por SLA',
  },
  comparison: {
    title: 'El Método Antiguo vs El Método Datafyle', sub: 'Los mismos documentos. Una experiencia completamente diferente.',
    oldBadge: 'Proceso Manual', oldTitle: 'El Método Antiguo',
    newBadge: 'Impulsado por IA', newTitle: 'El Método Datafyle',
  },
  howItWorks: {
    title: 'Cómo Funciona Datafyle', sub: 'De la carga a un Excel limpio en menos de 10 segundos.',
    s1: 'Sube Tu Documento', s1d: 'Arrastra cualquier PDF, Word, Excel, imagen o CSV — hasta 25MB. Sin plantillas, sin configuración.',
    s2: 'La IA Extrae Todo', s2d: 'Nuestra IA lee el documento y extrae automáticamente cada proveedor, importe, fecha, partida e impuesto.',
    s3: 'Descarga Excel Limpio', s3d: 'Obtén un archivo Excel estructurado en 3 hojas — Resumen, Partidas, Anomalías — listo para importar en cualquier software contable.',
  },
  sections: {
    features: 'Todo lo que Necesita Tu Equipo Contable', featuresSub: 'No solo extracción — una plataforma completa de inteligencia documental.',
    fileTypes: 'Funciona con Todos los Tipos de Archivo que Recibes de Clientes', fileTypesSub: 'Sin conversión, sin reformateo, sin excusas.',
    reviews: 'Con la Confianza de Profesionales Contables', reviewsSub: 'Reseñas reales de contadores y tenedores de libros reales.',
    reviewsVerified: 'Verificado', reviewsNote: 'Todas las reseñas son de clientes verificados en plataformas de terceros. No se ofrecieron incentivos.',
    calculator: 'Descubre Cuánto Tiempo y Dinero Puedes Ahorrar', calculatorSub: 'Ajusta los controles para que coincidan con tu firma. Los números se actualizan en tiempo real.',
    security: 'Tus Datos Financieros Están 100% Seguros', securitySub: 'Protegemos tus documentos con seguridad de nivel bancario. Cada archivo, cada byte — cifrado, aislado y nunca compartido.',
    securityBadge: 'Seguridad Empresarial',
    vsDocParser: 'Datafyle vs DocParser', vsDocParserSub: 'Ambas herramientas extraen datos de documentos. Esto es por qué los contadores eligen Datafyle.',
  },
  securityTrust: ['Cumplimiento GDPR', 'UK GDPR Listo', 'Cifrado AES-256', 'Sin Venta de Datos', 'Eliminación a Petición'],
  faq: {
    badge: '¿Tienes Preguntas?', title: 'Preguntas Frecuentes',
    sub: 'Todo lo que necesitas saber antes de pasarte a Datafyle.',
    all: 'Todo', features: 'Características', pricing: 'Precios', security: 'Seguridad', teams: 'Equipos',
    contactText: '¿Aún tienes preguntas sin respuesta?', contactBtn: 'Contactar al equipo',
  },
  cta: {
    title: 'Deja de Perder 8 Horas al Día en Entrada de Datos',
    sub: 'Únete a más de 50 firmas contables que ya ahorran tiempo con Datafyle',
    btn: 'Empezar Ahora — Es Gratis',
    note: 'Sin tarjeta de crédito · 10 documentos gratis · Configuración en 3 minutos',
  },
  dashboard: {
    morning: 'Buenos días', afternoon: 'Buenas tardes', evening: 'Buenas noches',
    totalProcessed: 'Total Procesado', thisMonth: 'Este Mes',
    fieldsExtracted: 'Campos Extraídos', anomalies: 'Anomalías',
    uploadBtn: 'Subir Documentos', uploadTitle: 'Arrastra archivos aquí o haz clic para buscar',
    uploadSub: 'PDF · Word · Excel · CSV · XML · TXT · Imágenes · Máx 25 MB',
    exportExcel: 'Exportar a Excel', exportAll: 'Exportar Todo', exportSelected: 'Exportar Selección',
    myDocuments: 'Mis Documentos', searchPlaceholder: 'Buscar por nombre o proveedor…',
    done: 'Listo', processing: 'Procesando', pending: 'Pendiente', failed: 'Error',
    noDocuments: 'Aún no hay documentos', noDocumentsSub: 'Sube tu primer documento arriba para comenzar.',
    downloadExcel: 'Descargar Excel', viewDetails: 'Ver Detalles',
    dismiss: 'Descartar', completeUpgrade: 'Completar Mejora →', viewPlans: 'Ver Planes',
    freePlanMsg: 'Estás en el plan Gratuito', freePlanSub: 'Mejora a Starter ($49/mes) para 500 documentos, detección de anomalías y funciones de equipo',
    batchUpload: 'Carga por Lotes', singleUpload: 'Carga Individual',
    copyJSON: 'Copiar JSON', copied: '¡Copiado!',
    fileName: 'Nombre del Archivo', fileType: 'Tipo', date: 'Fecha', status: 'Estado',
    confidence: 'Confianza', uploadedBy: 'Subido Por', allFiles: 'Todos los Archivos', filter: 'Filtrar',
  },
}

const fr: T = {
  nav: {
    about: 'À propos', howItWorks: 'Comment ça marche', features: 'Fonctionnalités',
    calculator: 'Calculateur', security: 'Sécurité', vsDocParser: 'vs DocParser',
    faq: 'FAQ', contact: 'Contact', pricing: 'Tarifs', login: 'Connexion',
    getStarted: 'Commencer', getStartedFree: 'Commencer Gratuitement',
    goToDashboard: 'Tableau de bord', aboutUs: 'À propos de nous',
    whyDatafyle: 'Pourquoi Datafyle', fileTypes: 'Types de fichiers',
    reviews: 'Avis', dataSecurity: 'Sécurité des données', teams: 'Équipes',
  },
  hero: {
    line1: 'Votre comptable coûte', price1: '2 500 $/mois.',
    line2: ' Datafyle coûte', price2: '49 $.',
    sub: 'Arrêtez de perdre des heures en saisie manuelle. Téléchargez n\'importe quelle facture, reçu ou relevé — PDF, Word, image ou CSV — et laissez l\'IA extraire chaque champ en moins de 10 secondes.',
    cta: 'Commencer Gratuitement', ctaDash: 'Tableau de bord',
    watchDemo: 'Voir la Démo', noCreditCard: 'Sans carte bancaire · 10 documents gratuits',
  },
  trust: {
    eyebrow: 'Approuvé par des cabinets comptables au Royaume-Uni, aux États-Unis et en Australie',
    firms: 'Cabinets Comptables', firmsSub: 'utilisent activement Datafyle',
    docs: 'Documents Traités', docsSub: 'factures, reçus et plus',
    rating: 'Note Moyenne', ratingSub: 'sur Capterra, G2 et Trustpilot',
    uptime: 'Disponibilité', uptimeSub: 'fiabilité garantie par SLA',
  },
  comparison: {
    title: 'L\'ancienne méthode vs La méthode Datafyle', sub: 'Les mêmes documents. Une expérience totalement différente.',
    oldBadge: 'Processus Manuel', oldTitle: 'L\'ancienne méthode',
    newBadge: 'Propulsé par IA', newTitle: 'La méthode Datafyle',
  },
  howItWorks: {
    title: 'Comment fonctionne Datafyle', sub: 'De l\'upload à l\'Excel propre en moins de 10 secondes.',
    s1: 'Téléchargez votre document', s1d: 'Déposez tout PDF, Word, Excel, image ou CSV — jusqu\'à 25 Mo. Sans modèle, sans configuration.',
    s2: 'L\'IA extrait tout', s2d: 'Notre IA lit le document et extrait automatiquement chaque fournisseur, montant, date, ligne et taxe.',
    s3: 'Téléchargez l\'Excel propre', s3d: 'Obtenez un fichier Excel structuré en 3 feuilles — Résumé, Lignes, Anomalies — prêt à importer dans n\'importe quel logiciel comptable.',
  },
  sections: {
    features: 'Tout ce dont Votre Équipe Comptable a Besoin', featuresSub: 'Pas seulement de l\'extraction — une plateforme complète d\'intelligence documentaire.',
    fileTypes: 'Compatible avec Tous les Types de Fichiers que Vous Recevez', fileTypesSub: 'Sans conversion, sans reformatage, sans excuses.',
    reviews: 'Approuvé par les Professionnels Comptables', reviewsSub: 'Vrais avis de vrais comptables et teneur de livres.',
    reviewsVerified: 'Vérifié', reviewsNote: 'Tous les avis proviennent de clients vérifiés sur des plateformes tierces. Aucune incitation n\'a été offerte.',
    calculator: 'Découvrez Combien de Temps et d\'Argent Vous Pouvez Économiser', calculatorSub: 'Ajustez les curseurs pour correspondre à votre cabinet. Les chiffres se mettent à jour en temps réel.',
    security: 'Vos Données Financières sont 100% Sécurisées', securitySub: 'Nous protégeons vos documents avec une sécurité de niveau bancaire. Chaque fichier, chaque octet — chiffré, isolé et jamais partagé.',
    securityBadge: 'Sécurité Enterprise',
    vsDocParser: 'Datafyle vs DocParser', vsDocParserSub: 'Les deux outils extraient des données de documents. Voici pourquoi les comptables choisissent Datafyle.',
  },
  securityTrust: ['Conforme RGPD', 'UK RGPD Prêt', 'Chiffré AES-256', 'Sans Vente de Données', 'Suppression sur Demande'],
  faq: {
    badge: 'Des Questions ?', title: 'Foire Aux Questions',
    sub: 'Tout ce que vous devez savoir avant de passer à Datafyle.',
    all: 'Tout', features: 'Fonctionnalités', pricing: 'Tarifs', security: 'Sécurité', teams: 'Équipes',
    contactText: 'D\'autres questions sans réponse ?', contactBtn: 'Contacter notre équipe',
  },
  cta: {
    title: 'Arrêtez de Perdre 8 Heures par Jour en Saisie de Données',
    sub: 'Rejoignez 50+ cabinets comptables qui gagnent déjà du temps avec Datafyle',
    btn: 'Commencer Maintenant — C\'est Gratuit',
    note: 'Sans carte bancaire · 10 documents gratuits · Installation en 3 minutes',
  },
  dashboard: {
    morning: 'Bonjour', afternoon: 'Bon après-midi', evening: 'Bonsoir',
    totalProcessed: 'Total Traité', thisMonth: 'Ce Mois',
    fieldsExtracted: 'Champs Extraits', anomalies: 'Anomalies',
    uploadBtn: 'Télécharger des Documents', uploadTitle: 'Déposez des fichiers ici ou cliquez pour parcourir',
    uploadSub: 'PDF · Word · Excel · CSV · XML · TXT · Images · Max 25 Mo',
    exportExcel: 'Exporter en Excel', exportAll: 'Tout Exporter', exportSelected: 'Exporter la Sélection',
    myDocuments: 'Mes Documents', searchPlaceholder: 'Rechercher par nom ou fournisseur…',
    done: 'Terminé', processing: 'Traitement', pending: 'En attente', failed: 'Échoué',
    noDocuments: 'Aucun document', noDocumentsSub: 'Téléchargez votre premier document ci-dessus pour commencer.',
    downloadExcel: 'Télécharger Excel', viewDetails: 'Voir les Détails',
    dismiss: 'Ignorer', completeUpgrade: 'Finaliser la mise à niveau →', viewPlans: 'Voir les forfaits',
    freePlanMsg: 'Vous êtes sur le plan Gratuit', freePlanSub: 'Passez à Starter (49 $/mois) pour 500 documents, la détection d\'anomalies et les fonctions d\'équipe',
    batchUpload: 'Lot de Téléchargements', singleUpload: 'Téléchargement Unique',
    copyJSON: 'Copier JSON', copied: 'Copié !',
    fileName: 'Nom du Fichier', fileType: 'Type', date: 'Date', status: 'Statut',
    confidence: 'Fiabilité', uploadedBy: 'Uploadé par', allFiles: 'Tous les fichiers', filter: 'Filtrer',
  },
}

const de: T = {
  nav: {
    about: 'Über uns', howItWorks: 'Wie es funktioniert', features: 'Funktionen',
    calculator: 'Rechner', security: 'Sicherheit', vsDocParser: 'vs DocParser',
    faq: 'FAQ', contact: 'Kontakt', pricing: 'Preise', login: 'Anmelden',
    getStarted: 'Loslegen', getStartedFree: 'Kostenlos Starten',
    goToDashboard: 'Zum Dashboard', aboutUs: 'Über uns',
    whyDatafyle: 'Warum Datafyle', fileTypes: 'Dateitypen',
    reviews: 'Bewertungen', dataSecurity: 'Datensicherheit', teams: 'Teams',
  },
  hero: {
    line1: 'Ihr Buchhalter kostet', price1: '2.500 $/Monat.',
    line2: ' Datafyle kostet', price2: '49 $.',
    sub: 'Hören Sie auf, Stunden mit manueller Dateneingabe zu verschwenden. Laden Sie jede Rechnung, jeden Beleg oder Kontoauszug hoch — PDF, Word, Bild oder CSV — und lassen Sie KI alle Felder in unter 10 Sekunden extrahieren.',
    cta: 'Kostenlos Starten', ctaDash: 'Zum Dashboard',
    watchDemo: 'Demo ansehen', noCreditCard: 'Keine Kreditkarte · 10 kostenlose Dokumente',
  },
  trust: {
    eyebrow: 'Vertrauen von Buchhaltungsfirmen in UK, USA und Australien',
    firms: 'Buchhaltungsfirmen', firmsSub: 'nutzen Datafyle aktiv',
    docs: 'Verarbeitete Dokumente', docsSub: 'Rechnungen, Belege und mehr',
    rating: 'Durchschnittsbewertung', ratingSub: 'auf Capterra, G2 & Trustpilot',
    uptime: 'Plattformverfügbarkeit', uptimeSub: 'SLA-gesicherte Zuverlässigkeit',
  },
  comparison: {
    title: 'Der alte Weg vs. Der Datafyle-Weg', sub: 'Dieselben Dokumente. Völlig andere Erfahrung.',
    oldBadge: 'Manueller Prozess', oldTitle: 'Der alte Weg',
    newBadge: 'KI-gestützt', newTitle: 'Der Datafyle-Weg',
  },
  howItWorks: {
    title: 'Wie Datafyle funktioniert', sub: 'Vom Upload zur sauberen Excel-Datei in unter 10 Sekunden.',
    s1: 'Dokument hochladen', s1d: 'Laden Sie jede PDF-, Word-, Excel-, Bild- oder CSV-Datei hoch — bis 25 MB. Keine Vorlagen, kein Setup.',
    s2: 'KI extrahiert alles', s2d: 'Unsere KI liest das Dokument und extrahiert automatisch jeden Anbieter, Betrag, Datum, jede Zeile und Steuer.',
    s3: 'Sauberes Excel herunterladen', s3d: 'Erhalten Sie eine strukturierte 3-Tabellen-Excel-Datei — Zusammenfassung, Positionen, Anomalien — bereit zum Import in jede Buchhaltungssoftware.',
  },
  sections: {
    features: 'Alles was Ihr Buchhaltungsteam braucht', featuresSub: 'Nicht nur Extraktion — eine vollständige Dokumentenintelligenzsplattform.',
    fileTypes: 'Unterstützt jeden Dateityp, den Sie von Kunden erhalten', fileTypesSub: 'Keine Konvertierung, kein Reformatieren, keine Ausreden.',
    reviews: 'Vertraut von Buchhaltungsprofis', reviewsSub: 'Echte Bewertungen von echten Buchhaltern und Buchführern.',
    reviewsVerified: 'Verifiziert', reviewsNote: 'Alle Bewertungen stammen von verifizierten Kunden auf Drittanbieterplattformen. Es wurden keine Anreize angeboten.',
    calculator: 'Sehen Sie, wie viel Zeit und Geld Sie sparen können', calculatorSub: 'Passen Sie die Regler an Ihre Firma an. Die Zahlen aktualisieren sich in Echtzeit.',
    security: 'Ihre Finanzdaten sind zu 100% sicher', securitySub: 'Wir schützen Ihre Dokumente mit Sicherheit auf Bankniveau. Jede Datei, jedes Byte — verschlüsselt, isoliert und niemals geteilt.',
    securityBadge: 'Enterprise-Sicherheit',
    vsDocParser: 'Datafyle vs DocParser', vsDocParserSub: 'Beide Tools extrahieren Daten aus Dokumenten. Deshalb wählen Buchhalter Datafyle.',
  },
  securityTrust: ['DSGVO-konform', 'UK DSGVO bereit', 'AES-256 verschlüsselt', 'Kein Datenverkauf', 'Löschung auf Anfrage'],
  faq: {
    badge: 'Fragen?', title: 'Häufig Gestellte Fragen',
    sub: 'Alles, was Sie vor dem Wechsel zu Datafyle wissen müssen.',
    all: 'Alle', features: 'Funktionen', pricing: 'Preise', security: 'Sicherheit', teams: 'Teams',
    contactText: 'Noch unbeantwortete Fragen?', contactBtn: 'Unser Team kontaktieren',
  },
  cta: {
    title: 'Hören Sie auf, 8 Stunden täglich für Dateneingabe zu verschwenden',
    sub: 'Schließen Sie sich 50+ Buchhaltungsfirmen an, die mit Datafyle Zeit sparen',
    btn: 'Jetzt Starten — Kostenlos',
    note: 'Keine Kreditkarte · 10 kostenlose Dokumente · Einrichtung in 3 Minuten',
  },
  dashboard: {
    morning: 'Guten Morgen', afternoon: 'Guten Tag', evening: 'Guten Abend',
    totalProcessed: 'Gesamt verarbeitet', thisMonth: 'Diesen Monat',
    fieldsExtracted: 'Felder extrahiert', anomalies: 'Anomalien',
    uploadBtn: 'Dokumente hochladen', uploadTitle: 'Dateien hier ablegen oder zum Suchen klicken',
    uploadSub: 'PDF · Word · Excel · CSV · XML · TXT · Bilder · Max 25 MB',
    exportExcel: 'Nach Excel exportieren', exportAll: 'Alles exportieren', exportSelected: 'Auswahl exportieren',
    myDocuments: 'Meine Dokumente', searchPlaceholder: 'Nach Dateiname oder Anbieter suchen…',
    done: 'Fertig', processing: 'Verarbeitung', pending: 'Ausstehend', failed: 'Fehlgeschlagen',
    noDocuments: 'Noch keine Dokumente', noDocumentsSub: 'Laden Sie oben Ihr erstes Dokument hoch, um zu beginnen.',
    downloadExcel: 'Excel herunterladen', viewDetails: 'Details ansehen',
    dismiss: 'Schließen', completeUpgrade: 'Upgrade abschließen →', viewPlans: 'Pläne ansehen',
    freePlanMsg: 'Sie nutzen den kostenlosen Plan', freePlanSub: 'Upgraden Sie auf Starter (49 $/Mon.) für 500 Dokumente, Anomalieerkennung und Teamfunktionen',
    batchUpload: 'Stapel-Upload', singleUpload: 'Einzelner Upload',
    copyJSON: 'JSON kopieren', copied: 'Kopiert!',
    fileName: 'Dateiname', fileType: 'Typ', date: 'Datum', status: 'Status',
    confidence: 'Konfidenz', uploadedBy: 'Hochgeladen von', allFiles: 'Alle Dateien', filter: 'Filtern',
  },
}

const zh: T = {
  nav: {
    about: '关于', howItWorks: '工作原理', features: '功能',
    calculator: '计算器', security: '安全', vsDocParser: 'vs DocParser',
    faq: '常见问题', contact: '联系我们', pricing: '定价', login: '登录',
    getStarted: '开始使用', getStartedFree: '免费开始',
    goToDashboard: '进入控制台', aboutUs: '关于我们',
    whyDatafyle: '为何选择Datafyle', fileTypes: '文件类型',
    reviews: '评价', dataSecurity: '数据安全', teams: '团队',
  },
  hero: {
    line1: '您的账务员每月花费', price1: '$2,500。',
    line2: ' Datafyle 只需', price2: '$49。',
    sub: '停止在手动数据录入上浪费数小时。上传任何发票、收据或报表——PDF、Word、图片或CSV——让AI在10秒内提取每个字段。',
    cta: '免费开始', ctaDash: '进入控制台',
    watchDemo: '观看演示', noCreditCard: '无需信用卡 · 10份免费文档',
  },
  trust: {
    eyebrow: '受到英国、美国和澳大利亚会计事务所的信赖',
    firms: '会计事务所', firmsSub: '正在积极使用Datafyle',
    docs: '已处理文档', docsSub: '发票、收据等',
    rating: '平均评分', ratingSub: '来自Capterra、G2和Trustpilot',
    uptime: '平台正常运行率', uptimeSub: 'SLA支持的可靠性',
  },
  comparison: {
    title: '传统方式 vs Datafyle方式', sub: '相同的文档，完全不同的体验。',
    oldBadge: '手动流程', oldTitle: '传统方式',
    newBadge: 'AI驱动', newTitle: 'Datafyle方式',
  },
  howItWorks: {
    title: 'Datafyle如何运作', sub: '从上传到整洁的Excel文件，不到10秒。',
    s1: '上传您的文档', s1d: '拖放任何PDF、Word、Excel、图片或CSV文件——最大25MB。无需模板，无需配置。',
    s2: 'AI提取所有内容', s2d: '我们的AI读取文档，自动提取每个供应商、金额、日期、明细和税额。',
    s3: '下载整洁的Excel', s3d: '获取结构化的3工作表Excel文件——摘要、明细项目、异常——可直接导入任何会计软件。',
  },
  sections: {
    features: '您的会计团队所需的一切', featuresSub: '不仅是提取——一个完整的文档智能平台。',
    fileTypes: '支持您从客户收到的每种文件类型', fileTypesSub: '无需转换，无需重新格式化，没有借口。',
    reviews: '受会计专业人士信赖', reviewsSub: '来自真实会计师和簿记员的真实评价。',
    reviewsVerified: '已验证', reviewsNote: '所有评价均来自第三方平台的经过验证的客户。未提供任何激励措施。',
    calculator: '了解您能节省多少时间和金钱', calculatorSub: '调整滑块以匹配您的事务所。数字实时更新。',
    security: '您的财务数据100%安全', securitySub: '我们用银行级安全保护您的文档。每个文件、每个字节——加密、隔离，永不共享。',
    securityBadge: '企业级安全',
    vsDocParser: 'Datafyle vs DocParser', vsDocParserSub: '两款工具都能从文档中提取数据。这就是会计师选择Datafyle的原因。',
  },
  securityTrust: ['符合GDPR', '符合英国GDPR', 'AES-256加密', '不出售数据', '应要求删除'],
  faq: {
    badge: '有问题？', title: '常见问题解答',
    sub: '在切换到Datafyle之前您需要了解的一切。',
    all: '全部', features: '功能', pricing: '定价', security: '安全', teams: '团队',
    contactText: '还有未解答的问题吗？', contactBtn: '联系我们的团队',
  },
  cta: {
    title: '停止每天浪费8小时在数据录入上',
    sub: '加入50多家已通过Datafyle节省时间的会计事务所',
    btn: '立即开始——免费',
    note: '无需信用卡 · 10份免费文档 · 3分钟完成设置',
  },
  dashboard: {
    morning: '早上好', afternoon: '下午好', evening: '晚上好',
    totalProcessed: '处理总数', thisMonth: '本月',
    fieldsExtracted: '已提取字段', anomalies: '异常',
    uploadBtn: '上传文档', uploadTitle: '将文件拖放到此处或单击浏览',
    uploadSub: 'PDF · Word · Excel · CSV · XML · TXT · 图片 · 最大25 MB',
    exportExcel: '导出到Excel', exportAll: '全部导出', exportSelected: '导出所选',
    myDocuments: '我的文档', searchPlaceholder: '按文件名或供应商搜索…',
    done: '完成', processing: '处理中', pending: '待处理', failed: '失败',
    noDocuments: '暂无文档', noDocumentsSub: '在上方上传您的第一份文档以开始使用。',
    downloadExcel: '下载Excel', viewDetails: '查看详情',
    dismiss: '关闭', completeUpgrade: '完成升级 →', viewPlans: '查看方案',
    freePlanMsg: '您正在使用免费计划', freePlanSub: '升级到Starter（$49/月）以获得500份文档、异常检测和团队功能',
    batchUpload: '批量上传', singleUpload: '单个上传',
    copyJSON: '复制JSON', copied: '已复制！',
    fileName: '文件名', fileType: '类型', date: '日期', status: '状态',
    confidence: '置信度', uploadedBy: '上传者', allFiles: '所有文件', filter: '筛选',
  },
}

const ja: T = {
  nav: {
    about: '概要', howItWorks: '使い方', features: '機能',
    calculator: '計算機', security: 'セキュリティ', vsDocParser: 'vs DocParser',
    faq: 'よくある質問', contact: 'お問い合わせ', pricing: '料金', login: 'ログイン',
    getStarted: '始める', getStartedFree: '無料で始める',
    goToDashboard: 'ダッシュボードへ', aboutUs: '私たちについて',
    whyDatafyle: 'なぜDatafyle？', fileTypes: 'ファイル形式',
    reviews: 'レビュー', dataSecurity: 'データセキュリティ', teams: 'チーム',
  },
  hero: {
    line1: '帳簿担当者に月額', price1: '$2,500 かかっています。',
    line2: ' Datafyle は', price2: '月 $49 です。',
    sub: '手動データ入力に何時間も費やすのをやめましょう。請求書、領収書、明細書をアップロード（PDF、Word、画像、CSV）すると、AIが10秒以内にすべての項目を抽出します。',
    cta: '無料で始める', ctaDash: 'ダッシュボードへ',
    watchDemo: 'デモを見る', noCreditCard: 'クレジットカード不要 · 10件無料',
  },
  trust: {
    eyebrow: '英国・米国・オーストラリアの会計事務所に信頼されています',
    firms: '会計事務所', firmsSub: 'がDatafyleを積極的に使用中',
    docs: '処理済み文書', docsSub: '請求書、領収書など',
    rating: '平均評価', ratingSub: 'Capterra、G2、Trustpilotより',
    uptime: 'プラットフォーム稼働率', uptimeSub: 'SLA保証による信頼性',
  },
  comparison: {
    title: '従来の方法 vs Datafyleの方法', sub: '同じ文書。まったく違う体験。',
    oldBadge: '手作業', oldTitle: '従来の方法',
    newBadge: 'AI搭載', newTitle: 'Datafyleの方法',
  },
  howItWorks: {
    title: 'Datafyleの使い方', sub: 'アップロードから整理されたExcelまで10秒以内。',
    s1: '文書をアップロード', s1d: 'PDF、Word、Excel、画像、CSVをドロップ（最大25MB）。テンプレート不要、設定不要。',
    s2: 'AIがすべてを抽出', s2d: 'AIが文書を読み取り、取引先、金額、日付、明細、税額をすべて自動で抽出します。',
    s3: '整理されたExcelをダウンロード', s3d: '3シート構成のExcelファイル（サマリー、明細、異常）を取得。会計ソフトへの即インポートが可能。',
  },
  sections: {
    features: '会計チームに必要なすべての機能', featuresSub: '単なる抽出にとどまらない、完全なドキュメントインテリジェンスプラットフォーム。',
    fileTypes: 'クライアントから受け取るあらゆるファイル形式に対応', fileTypesSub: '変換不要、再フォーマット不要、言い訳不要。',
    reviews: '会計専門家に信頼されています', reviewsSub: '実際の会計士・簿記担当者による本物のレビュー。',
    reviewsVerified: '確認済み', reviewsNote: 'すべてのレビューはサードパーティプラットフォームの確認済み顧客のものです。インセンティブは提供されていません。',
    calculator: 'どれだけの時間とお金を節約できるか見てみましょう', calculatorSub: 'スライダーを調整して、事務所の状況に合わせてください。数字はリアルタイムで更新されます。',
    security: '財務データは100%安全に保護', securitySub: '銀行レベルのセキュリティで文書を保護します。すべてのファイル、すべてのバイトが暗号化・隔離され、共有されることはありません。',
    securityBadge: 'エンタープライズグレードのセキュリティ',
    vsDocParser: 'Datafyle vs DocParser', vsDocParserSub: 'どちらのツールも文書からデータを抽出します。会計士がDatafyleを選ぶ理由をご覧ください。',
  },
  securityTrust: ['GDPR準拠', '英国GDPR対応', 'AES-256暗号化', 'データ販売なし', '要求に応じた削除'],
  faq: {
    badge: 'ご質問は？', title: 'よくあるご質問',
    sub: 'Datafyleに切り替える前に知っておくべきことをすべてご紹介します。',
    all: 'すべて', features: '機能', pricing: '料金', security: 'セキュリティ', teams: 'チーム',
    contactText: 'まだ解決していないご質問がありますか？', contactBtn: 'チームにお問い合わせ',
  },
  cta: {
    title: '1日8時間のデータ入力作業をやめましょう',
    sub: 'すでにDatafyleで時間を節約している50社以上の会計事務所に加わりましょう',
    btn: '今すぐ始める — 無料',
    note: 'クレジットカード不要 · 10件無料 · 3分でセットアップ',
  },
  dashboard: {
    morning: 'おはようございます', afternoon: 'こんにちは', evening: 'こんばんは',
    totalProcessed: '処理合計', thisMonth: '今月',
    fieldsExtracted: '抽出フィールド数', anomalies: '異常',
    uploadBtn: '文書をアップロード', uploadTitle: 'ここにファイルをドロップするかクリックして選択',
    uploadSub: 'PDF · Word · Excel · CSV · XML · TXT · 画像 · 最大25 MB',
    exportExcel: 'Excelにエクスポート', exportAll: 'すべてエクスポート', exportSelected: '選択項目をエクスポート',
    myDocuments: 'マイドキュメント', searchPlaceholder: 'ファイル名または取引先で検索…',
    done: '完了', processing: '処理中', pending: '保留中', failed: '失敗',
    noDocuments: 'まだ文書がありません', noDocumentsSub: '上の欄から最初の文書をアップロードして始めましょう。',
    downloadExcel: 'Excelをダウンロード', viewDetails: '詳細を見る',
    dismiss: '閉じる', completeUpgrade: 'アップグレードを完了 →', viewPlans: 'プランを見る',
    freePlanMsg: '無料プランを使用中', freePlanSub: 'Starterプラン（月$49）にアップグレードして500件の文書、異常検知、チーム機能を利用しましょう',
    batchUpload: '一括アップロード', singleUpload: '個別アップロード',
    copyJSON: 'JSONをコピー', copied: 'コピー済み！',
    fileName: 'ファイル名', fileType: '種類', date: '日付', status: 'ステータス',
    confidence: '信頼度', uploadedBy: 'アップロード者', allFiles: 'すべてのファイル', filter: 'フィルター',
  },
}

const pt: T = {
  nav: {
    about: 'Sobre', howItWorks: 'Como Funciona', features: 'Recursos',
    calculator: 'Calculadora', security: 'Segurança', vsDocParser: 'vs DocParser',
    faq: 'FAQ', contact: 'Contato', pricing: 'Preços', login: 'Entrar',
    getStarted: 'Começar', getStartedFree: 'Começar Grátis',
    goToDashboard: 'Ir ao Painel', aboutUs: 'Sobre Nós',
    whyDatafyle: 'Por que Datafyle', fileTypes: 'Tipos de Arquivo',
    reviews: 'Avaliações', dataSecurity: 'Segurança de Dados', teams: 'Equipes',
  },
  hero: {
    line1: 'Seu contador custa', price1: '$2.500/mês.',
    line2: ' O Datafyle custa', price2: '$49.',
    sub: 'Pare de perder horas com entrada manual de dados. Envie qualquer fatura, recibo ou extrato — PDF, Word, imagem ou CSV — e deixe a IA extrair cada campo em menos de 10 segundos.',
    cta: 'Começar Grátis', ctaDash: 'Ir ao Painel',
    watchDemo: 'Ver Demo', noCreditCard: 'Sem cartão de crédito · 10 documentos grátis',
  },
  trust: {
    eyebrow: 'Confiado por empresas contábeis no Reino Unido, EUA e Austrália',
    firms: 'Empresas Contábeis', firmsSub: 'usando Datafyle ativamente',
    docs: 'Documentos Processados', docsSub: 'faturas, recibos e mais',
    rating: 'Avaliação Média', ratingSub: 'no Capterra, G2 e Trustpilot',
    uptime: 'Disponibilidade', uptimeSub: 'confiabilidade garantida por SLA',
  },
  comparison: {
    title: 'O Jeito Antigo vs O Jeito Datafyle', sub: 'Os mesmos documentos. Uma experiência completamente diferente.',
    oldBadge: 'Processo Manual', oldTitle: 'O Jeito Antigo',
    newBadge: 'Impulsionado por IA', newTitle: 'O Jeito Datafyle',
  },
  howItWorks: {
    title: 'Como o Datafyle Funciona', sub: 'Do upload ao Excel limpo em menos de 10 segundos.',
    s1: 'Envie Seu Documento', s1d: 'Arraste qualquer PDF, Word, Excel, imagem ou CSV — até 25 MB. Sem modelos, sem configuração.',
    s2: 'A IA Extrai Tudo', s2d: 'Nossa IA lê o documento e extrai automaticamente cada fornecedor, valor, data, item e imposto.',
    s3: 'Baixe o Excel Limpo', s3d: 'Obtenha um arquivo Excel estruturado em 3 abas — Resumo, Itens, Anomalias — pronto para importar em qualquer software de contabilidade.',
  },
  sections: {
    features: 'Tudo que Sua Equipe Contábil Precisa', featuresSub: 'Não é só extração — é uma plataforma completa de inteligência documental.',
    fileTypes: 'Funciona com Todos os Tipos de Arquivo que Você Recebe', fileTypesSub: 'Sem conversão, sem reformatação, sem desculpas.',
    reviews: 'Confiado por Profissionais Contábeis', reviewsSub: 'Avaliações reais de contadores e auxiliares de escrituração reais.',
    reviewsVerified: 'Verificado', reviewsNote: 'Todas as avaliações são de clientes verificados em plataformas de terceiros. Nenhum incentivo foi oferecido.',
    calculator: 'Veja Quanto Tempo e Dinheiro Você Pode Economizar', calculatorSub: 'Ajuste os controles para corresponder à sua empresa. Os números se atualizam em tempo real.',
    security: 'Seus Dados Financeiros são 100% Seguros', securitySub: 'Protegemos seus documentos com segurança de nível bancário. Cada arquivo, cada byte — criptografado, isolado e nunca compartilhado.',
    securityBadge: 'Segurança Empresarial',
    vsDocParser: 'Datafyle vs DocParser', vsDocParserSub: 'Ambas as ferramentas extraem dados de documentos. Veja por que os contadores escolhem o Datafyle.',
  },
  securityTrust: ['Conformidade LGPD/GDPR', 'UK GDPR Pronto', 'Criptografia AES-256', 'Sem Venda de Dados', 'Exclusão sob Demanda'],
  faq: {
    badge: 'Tem Perguntas?', title: 'Perguntas Frequentes',
    sub: 'Tudo o que você precisa saber antes de mudar para o Datafyle.',
    all: 'Todos', features: 'Recursos', pricing: 'Preços', security: 'Segurança', teams: 'Equipes',
    contactText: 'Ainda tem perguntas sem resposta?', contactBtn: 'Contatar nossa equipe',
  },
  cta: {
    title: 'Pare de Desperdiçar 8 Horas por Dia em Entrada de Dados',
    sub: 'Junte-se a 50+ empresas contábeis que já economizam tempo com Datafyle',
    btn: 'Começar Agora — É Grátis',
    note: 'Sem cartão de crédito · 10 documentos grátis · Configuração em 3 minutos',
  },
  dashboard: {
    morning: 'Bom dia', afternoon: 'Boa tarde', evening: 'Boa noite',
    totalProcessed: 'Total Processado', thisMonth: 'Este Mês',
    fieldsExtracted: 'Campos Extraídos', anomalies: 'Anomalias',
    uploadBtn: 'Enviar Documentos', uploadTitle: 'Solte arquivos aqui ou clique para navegar',
    uploadSub: 'PDF · Word · Excel · CSV · XML · TXT · Imagens · Máx 25 MB',
    exportExcel: 'Exportar para Excel', exportAll: 'Exportar Tudo', exportSelected: 'Exportar Seleção',
    myDocuments: 'Meus Documentos', searchPlaceholder: 'Buscar por nome ou fornecedor…',
    done: 'Concluído', processing: 'Processando', pending: 'Pendente', failed: 'Falhou',
    noDocuments: 'Nenhum documento ainda', noDocumentsSub: 'Envie seu primeiro documento acima para começar.',
    downloadExcel: 'Baixar Excel', viewDetails: 'Ver Detalhes',
    dismiss: 'Dispensar', completeUpgrade: 'Concluir Upgrade →', viewPlans: 'Ver Planos',
    freePlanMsg: 'Você está no plano Gratuito', freePlanSub: 'Faça upgrade para Starter ($49/mês) para 500 documentos, detecção de anomalias e recursos de equipe',
    batchUpload: 'Upload em Lote', singleUpload: 'Upload Individual',
    copyJSON: 'Copiar JSON', copied: 'Copiado!',
    fileName: 'Nome do Arquivo', fileType: 'Tipo', date: 'Data', status: 'Status',
    confidence: 'Confiança', uploadedBy: 'Enviado por', allFiles: 'Todos os Arquivos', filter: 'Filtrar',
  },
}

const it: T = {
  nav: {
    about: 'Chi siamo', howItWorks: 'Come Funziona', features: 'Funzionalità',
    calculator: 'Calcolatore', security: 'Sicurezza', vsDocParser: 'vs DocParser',
    faq: 'FAQ', contact: 'Contatto', pricing: 'Prezzi', login: 'Accedi',
    getStarted: 'Inizia', getStartedFree: 'Inizia Gratis',
    goToDashboard: 'Vai alla Dashboard', aboutUs: 'Chi Siamo',
    whyDatafyle: 'Perché Datafyle', fileTypes: 'Tipi di File',
    reviews: 'Recensioni', dataSecurity: 'Sicurezza Dati', teams: 'Team',
  },
  hero: {
    line1: 'Il tuo contabile costa', price1: '$2.500/mese.',
    line2: ' Datafyle costa', price2: '$49.',
    sub: 'Smetti di sprecare ore nell\'inserimento manuale dei dati. Carica qualsiasi fattura, ricevuta o estratto conto — PDF, Word, immagine o CSV — e lascia che l\'AI estragga ogni campo in meno di 10 secondi.',
    cta: 'Inizia Gratis', ctaDash: 'Vai alla Dashboard',
    watchDemo: 'Guarda la Demo', noCreditCard: 'Nessuna carta di credito · 10 documenti gratuiti',
  },
  trust: {
    eyebrow: 'Scelto da studi contabili in UK, USA e Australia',
    firms: 'Studi Contabili', firmsSub: 'usano attivamente Datafyle',
    docs: 'Documenti Elaborati', docsSub: 'fatture, ricevute e altro',
    rating: 'Valutazione Media', ratingSub: 'su Capterra, G2 e Trustpilot',
    uptime: 'Disponibilità Piattaforma', uptimeSub: 'affidabilità garantita SLA',
  },
  comparison: {
    title: 'Il Vecchio Metodo vs Il Metodo Datafyle', sub: 'Gli stessi documenti. Un\'esperienza completamente diversa.',
    oldBadge: 'Processo Manuale', oldTitle: 'Il Vecchio Metodo',
    newBadge: 'Alimentato da AI', newTitle: 'Il Metodo Datafyle',
  },
  howItWorks: {
    title: 'Come Funziona Datafyle', sub: 'Dal caricamento a un Excel pulito in meno di 10 secondi.',
    s1: 'Carica il Tuo Documento', s1d: 'Trascina qualsiasi PDF, Word, Excel, immagine o CSV — fino a 25 MB. Nessun modello, nessuna configurazione.',
    s2: 'L\'AI Estrae Tutto', s2d: 'La nostra AI legge il documento ed estrae automaticamente ogni fornitore, importo, data, voce e imposta.',
    s3: 'Scarica l\'Excel Pulito', s3d: 'Ottieni un file Excel strutturato in 3 fogli — Riepilogo, Voci, Anomalie — pronto per l\'importazione in qualsiasi software contabile.',
  },
  sections: {
    features: 'Tutto ciò di cui il Tuo Team Contabile ha Bisogno', featuresSub: 'Non solo estrazione — una piattaforma completa di intelligenza documentale.',
    fileTypes: 'Funziona con Tutti i Tipi di File che Ricevi dai Clienti', fileTypesSub: 'Nessuna conversione, nessuna riformattazione, nessuna scusa.',
    reviews: 'Scelto dai Professionisti Contabili', reviewsSub: 'Recensioni vere da veri contabili e addetti alla contabilità.',
    reviewsVerified: 'Verificato', reviewsNote: 'Tutte le recensioni provengono da clienti verificati su piattaforme di terze parti. Non sono stati offerti incentivi.',
    calculator: 'Scopri Quanto Tempo e Denaro Puoi Risparmiare', calculatorSub: 'Regola i cursori per adattarli alla tua azienda. I numeri si aggiornano in tempo reale.',
    security: 'I Tuoi Dati Finanziari sono 100% al Sicuro', securitySub: 'Proteggiamo i tuoi documenti con sicurezza di livello bancario. Ogni file, ogni byte — crittografato, isolato e mai condiviso.',
    securityBadge: 'Sicurezza Enterprise',
    vsDocParser: 'Datafyle vs DocParser', vsDocParserSub: 'Entrambi gli strumenti estraggono dati dai documenti. Ecco perché i contabili scelgono Datafyle.',
  },
  securityTrust: ['Conforme GDPR', 'UK GDPR Pronto', 'Crittografato AES-256', 'Nessuna Vendita di Dati', 'Eliminazione su Richiesta'],
  faq: {
    badge: 'Hai Domande?', title: 'Domande Frequenti',
    sub: 'Tutto quello che devi sapere prima di passare a Datafyle.',
    all: 'Tutti', features: 'Funzionalità', pricing: 'Prezzi', security: 'Sicurezza', teams: 'Team',
    contactText: 'Hai ancora domande senza risposta?', contactBtn: 'Contatta il nostro team',
  },
  cta: {
    title: 'Smetti di Sprecare 8 Ore al Giorno nell\'Inserimento Dati',
    sub: 'Unisciti a 50+ studi contabili che risparmiano già tempo con Datafyle',
    btn: 'Inizia Ora — È Gratuito',
    note: 'Nessuna carta di credito · 10 documenti gratuiti · Configurazione in 3 minuti',
  },
  dashboard: {
    morning: 'Buongiorno', afternoon: 'Buon pomeriggio', evening: 'Buonasera',
    totalProcessed: 'Totale Elaborato', thisMonth: 'Questo Mese',
    fieldsExtracted: 'Campi Estratti', anomalies: 'Anomalie',
    uploadBtn: 'Carica Documenti', uploadTitle: 'Trascina i file qui o clicca per sfogliare',
    uploadSub: 'PDF · Word · Excel · CSV · XML · TXT · Immagini · Max 25 MB',
    exportExcel: 'Esporta in Excel', exportAll: 'Esporta Tutto', exportSelected: 'Esporta Selezione',
    myDocuments: 'I Miei Documenti', searchPlaceholder: 'Cerca per nome file o fornitore…',
    done: 'Completato', processing: 'Elaborazione', pending: 'In attesa', failed: 'Fallito',
    noDocuments: 'Nessun documento ancora', noDocumentsSub: 'Carica il tuo primo documento qui sopra per iniziare.',
    downloadExcel: 'Scarica Excel', viewDetails: 'Visualizza Dettagli',
    dismiss: 'Ignora', completeUpgrade: 'Completa Aggiornamento →', viewPlans: 'Vedi Piani',
    freePlanMsg: 'Sei sul piano Gratuito', freePlanSub: 'Passa a Starter ($49/mese) per 500 documenti, rilevamento anomalie e funzioni del team',
    batchUpload: 'Caricamento Batch', singleUpload: 'Caricamento Singolo',
    copyJSON: 'Copia JSON', copied: 'Copiato!',
    fileName: 'Nome File', fileType: 'Tipo', date: 'Data', status: 'Stato',
    confidence: 'Affidabilità', uploadedBy: 'Caricato da', allFiles: 'Tutti i File', filter: 'Filtra',
  },
}

export const translations: Record<Language, T> = { en, es, fr, de, zh, ja, pt, it }
