import burger from "../../assets/img/burger.jpg";
export default [
  {
    id: "p1",
    url: burger,
    category: "Çorbalar",
    subCategory: "Mercimek Çorbası",
    name: "Mercimek Çorbası",
    description: "Ev usulü mercimek çorbası, zeytinyağlı ve limonlu.",
    recommendation: false,
    hide: false,
    portions: [
      {
        name: "Küçük",
        price: 45,
        orderTags: [
          {
            id: 1,
            name: "Baharat Seçimi",
            orderTagItems: [
              { id: 101, name: "Acılı", price: 5 },
              { id: 102, name: "Tuzsuz", price: 0 },
            ],
          },
        ],
      },
      {
        name: "Büyük",
        price: 60,
        orderTags: [],
      },
    ],
  },
  {
    id: "p2",
    url: burger,
    category: "Ana Yemekler",
    subCategory: "Et Sote",
    name: "Et Sote",
    description: "Soğanlı, biberli dana eti sotelenmiş, pilav ile servis.",
    recommendation: true,
    hide: false,
    portions: [
      {
        name: "Normal",
        price: 140,
        orderTags: [
          {
            id: 2,
            name: "Pişirme Tercihi",
            orderTagItems: [
              { id: 201, name: "Az Pişmiş", price: 0 },
              { id: 202, name: "Orta", price: 0 },
              { id: 203, name: "İyi Pişmiş", price: 0 },
            ],
          },
        ],
      },
      {
        name: "Büyük",
        price: 180,
        orderTags: [],
      },
    ],
  },
  {
    id: "p3",
    url: burger,
    category: "Pilavlar",
    subCategory: "Bulgur Pilavı",
    name: "Bulgur Pilavı",
    description: "Tereyağlı, ince bulgurlu pilav.",
    recommendation: false,
    hide: false,
    portions: [{ name: "Normal", price: 50, orderTags: [] }],
  },
  {
    id: "p4",
    url: burger,
    category: "Hamur İşleri",
    subCategory: "Gözleme",
    name: "Kıymalı Gözleme",
    description: "El açması kıymalı gözleme, yanında yoğurt.",
    recommendation: true,
    hide: false,
    portions: [{ name: "Adet", price: 85, orderTags: [] }],
  },
  {
    id: "p5",
    url: burger,
    category: "Deniz Ürünleri",
    subCategory: "Tavuk Şiş",
    name: "Tavuk Şiş",
    description: "Izgara tavuk şiş, salata ve lavaş ile.",
    recommendation: false,
    hide: false,
    portions: [
      {
        name: "Normal",
        price: 125,
        orderTags: [
          {
            id: 3,
            name: "Eklentiler",
            orderTagItems: [
              { id: 301, name: "Ezme", price: 8 },
              { id: 302, name: "Patates", price: 12 },
            ],
          },
        ],
      },
      { name: "Ekstra", price: 155, orderTags: [] },
    ],
  },
  {
    id: "p6",
    url: burger,
    category: "Tatlılar",
    subCategory: "Künefe",
    name: "Künefe",
    description: "Sıcak, şerbetli tel kadayıf ve kaşar peyniri ile.",
    recommendation: false,
    hide: false,
    portions: [
      {
        name: "Tek Kişilik",
        price: 95,
        orderTags: [
          {
            id: 4,
            name: "Servis Seçeneği",
            orderTagItems: [
              { id: 401, name: "Sıcacık", price: 0 },
              { id: 402, name: "Soğuk", price: 0 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "p7",
    url: burger,
    category: "Salatalar",
    subCategory: "Çoban Salatası",
    name: "Çoban Salatası",
    description: "Domates, salatalık, soğan ve biber ile mevsim salatası.",
    recommendation: false,
    hide: false,
    portions: [{ name: "Normal", price: 55, orderTags: [] }],
  },
  {
    id: "p8",
    url: burger,
    category: "Meze ve Aperatifler",
    subCategory: "Acılı Ezme",
    name: "Acılı Ezme",
    description: "Acılı, baharatlı domates ezmesi.",
    recommendation: false,
    hide: false,
    portions: [
      {
        name: "Küçük",
        price: 35,
        orderTags: [
          {
            id: 5,
            name: "Eşlikçi",
            orderTagItems: [
              { id: 501, name: "Lavash", price: 2 },
              { id: 502, name: "Ekmek", price: 1 },
            ],
          },
        ],
      },
      { name: "Büyük", price: 60, orderTags: [] },
    ],
  },
  {
    id: "p9",
    url: burger,
    category: "İçecekler",
    subCategory: "Ayran",
    name: "Ayran",
    description: "Soğuk ve ferahlatıcı ayran.",
    recommendation: false,
    hide: false,
    portions: [{ name: "Bardakta", price: 25, orderTags: [] }],
  },
  {
    id: "p10",
    url: burger,
    category: "İçecekler",
    subCategory: "Kola",
    name: "Kola (330ml)",
    description: "Soğuk gazlı içecek.",
    recommendation: false,
    hide: false,
    portions: [
      { name: "330ml", price: 30, orderTags: [] },
      {
        name: "1 L",
        price: 50,
        orderTags: [
          {
            id: 6,
            name: "Buz Miktarı",
            orderTagItems: [
              { id: 601, name: "Bol", price: 0 },
              { id: 602, name: "Az", price: 0 },
              { id: 603, name: "Buzsuz", price: 0 },
            ],
          },
        ],
      },
    ],
  },
];
