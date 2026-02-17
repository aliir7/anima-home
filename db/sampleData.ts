export const sampleData = {
  products: [
    {
      category: {
        id: "b6a2a6d6-9a3e-4c0c-9d3b-2c6c5a3d8f01",
        title: "هود آشپزخانه",
        slug: "kitchen-hood",
        parentId: null,
      },

      product: {
        id: "c2d9a9a1-6b34-4c6a-9f47-9fefb8f13a11",
        title: "هود مورب H303",
        slug: "hood-h303",
        rating: "0.0",
        numReviews: 0,
        isActive: true,
      },

      variant: {
        id: "f1b5b9b3-2d44-4ef5-8e25-4b4a3f6b9123",
        title: "هود H303 مشکی 90 سانتی",
        sku: "H303-BLACK-90",

        price: 12_500_000, // تومان – integer
        stock: 15,
        isActive: true,

        specs: {
          widthCm: 90,
          color: "black",
          glassType: "tempered",
          motorPower: "700m3/h",
          noiseLevelDb: 58,
          controlType: "touch",
          lighting: "LED",
          filterType: "aluminum",
          warrantyMonths: 24,
        },

        images: ["/images/products/testproduct.webp"],
      },
    },
  ],

  users: [
    {
      name: "Ali",
      email: "ali@example.com",
      password: "12345678",
      role: "admin",
    },
  ],

  // blogs
};

export const dummyProjects = [
  {
    id: "1",
    title: "کابینت کلاسیک",
    slug: "کابینت-کلاسیک",
    category: { id: "a", name: "کابینت" },
    images: ["/dummy/project1.jpg"],
    videos: ["/dummy/project1.mp4"],
    createdAt: "2025/10/2",
  },
  {
    id: "2",
    title: "تی‌وی وال مدرن",
    slug: "تی-وی-وال-مدرن",
    category: { id: "b", name: "تی وی وال" },
    images: ["/dummy/project2.jpg"],
    videos: [],
    createdAt: "2025/1/2",
  },
  {
    id: "3",
    title: "کمد ریلی",
    slug: "کمد-ریلی",
    category: { id: "c", name: "کمد" },
    images: ["/dummy/project3.jpg"],
    videos: [],
    createdAt: "2024/10/2",
  },
];

export default sampleData;
