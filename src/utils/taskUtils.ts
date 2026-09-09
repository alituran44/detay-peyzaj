import type { ProjectTask, SelectedServices } from '../types/auth';

export const getDefaultTasksForOrder = (orderId: string, services?: SelectedServices): ProjectTask[] => {
  const list: ProjectTask[] = [
    {
      id: `${orderId}-task-1`,
      orderId,
      title: '1. Arsa Sınırları, DWG Harita & İmar Çapı İncelemesi',
      category: 'analiz',
      status: 'bitti',
      updatedAt: new Date().toISOString(),
    },
    {
      id: `${orderId}-task-2`,
      orderId,
      title: '2. Yapısal Peyzaj Vaziyet Planı & Fonksiyon Zonlaması (.DWG)',
      category: 'vaziyet_plan',
      status: 'devam_ediyor',
      updatedAt: new Date().toISOString(),
    },
    {
      id: `${orderId}-task-3`,
      orderId,
      title: '3. Bitkisel Tasarım Planı & İklime Uygun Ağaç/Çalı Lejantı',
      category: 'bitki',
      status: 'bekliyor',
      updatedAt: new Date().toISOString(),
    },
  ];

  if (!services || services.irrigationProject) {
    list.push({
      id: `${orderId}-task-4`,
      orderId,
      title: '4. Otomatik Sulama Borulama & Damlama/Rotor Tesisat Projesi',
      category: 'sulama',
      status: 'bekliyor',
      updatedAt: new Date().toISOString(),
    });
  }

  list.push({
    id: `${orderId}-task-5`,
    orderId,
    title: '5. Gece Bahçe Aydınlatma Armatür & Kablo Dağıtım Planı',
    category: 'aydinlatma',
    status: 'bekliyor',
    updatedAt: new Date().toISOString(),
  });

  if (!services || services.visual3D) {
    list.push({
      id: `${orderId}-task-6`,
      orderId,
      title: '6. 4K Fotogerçekçi 3D Dış Mekan Modelleme & Render Üretimi',
      category: 'render3d',
      status: 'bekliyor',
      updatedAt: new Date().toISOString(),
    });
  }

  list.push(
    {
      id: `${orderId}-task-7`,
      orderId,
      title: '7. Metraj, Keşif Özeti & Uygulama Malzeme Listesi Cetveli',
      category: 'kesif',
      status: 'bekliyor',
      updatedAt: new Date().toISOString(),
    },
    {
      id: `${orderId}-task-8`,
      orderId,
      title: '8. Resmi E-Arşiv Fatura Tanzimi & Proje Teslim Paketi (.ZIP / .DWG)',
      category: 'teslimat',
      status: 'bekliyor',
      updatedAt: new Date().toISOString(),
    }
  );

  return list;
};
