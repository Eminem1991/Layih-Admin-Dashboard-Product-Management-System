const productsData = [
  {
    id: 1,
    title: 'Qulaqlıq Wireless Noise-Cancel',
    category: 'Elektronika',
    price: 249.99,
    stock: 11,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
  },
  {
    id: 2,
    title: 'Smart Qol Saatı S8',
    category: 'Elektronika',
    price: 189.0,
    stock: 3,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
  },
  {
    id: 3,
    title: 'Dəri Kürək Çantası',
    category: 'Aksessuar',
    price: 95.5,
    stock: 0,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80',
  },
  {
    id: 4,
    title: 'Erqonomik Ofis Stulu',
    category: 'Mebellər',
    price: 320.0,
    stock: 7,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=500&q=80',
  },
  {
    id: 5,
    title: 'Kişi Üçün Saqqal Baxım Dəsti',
    category: 'Kosmetika və Baxım',
    price: 45.0,
    stock: 24,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&q=80',
  },
  {
    id: 6,
    title: 'Ultra incə Laptop Pro 15',
    category: 'Elektronika',
    price: 1450.0,
    stock: 5,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80',
  },
  {
    id: 7,
    title: 'Mexanik Oyun Klaviaturası',
    category: 'Elektronika',
    price: 110.0,
    stock: 2,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
  },
  {
    id: 8,
    title: 'Kabelsiz Optik Sıçan',
    category: 'Elektronika',
    price: 35.5,
    stock: 18,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80',
  },
  {
    id: 9,
    title: 'HD Veb Kamera 1080p',
    category: 'Elektronika',
    price: 75.0,
    stock: 0,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=500&q=80',
  },
  {
    id: 10,
    title: 'Portativ Bluetooth Səsgücləndirici',
    category: 'Elektronika',
    price: 68.0,
    stock: 14,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80',
  },
  {
    id: 11,
    title: 'Klassik Kişi Qol Saatı',
    category: 'Aksessuar',
    price: 210.0,
    stock: 4,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80',
  },
  {
    id: 12,
    title: 'Qadın Günəş Eynəyi',
    category: 'Aksessuar',
    price: 85.0,
    stock: 1,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80',
  },
  {
    id: 13,
    title: 'Dəri Pul Qabı',
    category: 'Aksessuar',
    price: 42.0,
    stock: 30,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80',
  },
  {
    id: 14,
    title: 'İdman Üçün Su Qabı (BPA-Free)',
    category: 'Aksessuar',
    price: 18.5,
    stock: 50,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80',
  },
  {
    id: 15,
    title: 'Stolüstü LED Lampa',
    category: 'Mebellər',
    price: 48.0,
    stock: 0,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=500&q=80',
  },
  {
    id: 16,
    title: 'Taxta Yazı Masası',
    category: 'Mebellər',
    price: 280.0,
    stock: 6,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&q=80',
  },
  {
    id: 17,
    title: 'Kitab Rəfi (Modern)',
    category: 'Mebellər',
    price: 150.0,
    stock: 2,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=500&q=80',
  },
  {
    id: 18,
    title: 'Nəmləndirici Üz Kremi',
    category: 'Kosmetika və Baxım',
    price: 28.0,
    stock: 19,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80',
  },
  {
    id: 19,
    title: 'Təbii Saç Şampunu',
    category: 'Kosmetika və Baxım',
    price: 16.0,
    stock: 25,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&q=80',
  },
  {
    id: 20,
    title: 'Mat Dodaq Boyası Dəsti',
    category: 'Kosmetika və Baxım',
    price: 34.0,
    stock: 0,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80',
  },
  {
    id: 21,
    title: 'Aromatik Ətir Yağı',
    category: 'Kosmetika və Baxım',
    price: 22.5,
    stock: 12,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=80',
  },
  {
    id: 22,
    title: '4K Aksion Kamera',
    category: 'Elektronika',
    price: 230.0,
    stock: 8,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80',
  },
  {
    id: 23,
    title: 'Mikrofon Podkast Üçün',
    category: 'Elektronika',
    price: 135.0,
    stock: 3,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80',
  },
  {
    id: 24,
    title: 'Powerbank 20000mAh',
    category: 'Elektronika',
    price: 55.0,
    stock: 22,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1609592424089-9a2d80d276b9?w=500&q=80',
  },
  {
    id: 25,
    title: 'Səyahət Çantası',
    category: 'Aksessuar',
    price: 115.0,
    stock: 10,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
  },
  {
    id: 26,
    title: 'Minimalist Divar Saatı',
    category: 'Mebellər',
    price: 39.0,
    stock: 15,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500&q=80',
  },
  {
    id: 27,
    title: 'Yoga Xalçası (Mat)',
    category: 'Aksessuar',
    price: 29.9,
    stock: 0,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&q=80',
  },
  {
    id: 28,
    title: 'Elektrikli Diş Fırçası',
    category: 'Kosmetika və Baxım',
    price: 64.0,
    stock: 13,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1559656914-a30970c1affd?w=500&q=80',
  },
  {
    id: 29,
    title: 'Oyun Konsolu Pultu',
    category: 'Elektronika',
    price: 99.0,
    stock: 7,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=500&q=80',
  },
  {
    id: 30,
    title: 'E-Kitab Oxuyucu',
    category: 'Elektronika',
    price: 175.0,
    stock: 2,
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80',
  },
]

export default productsData
