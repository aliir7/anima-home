export const sampleData = {
  products: [
    {
      id: 1,
      name: "مبل مدرن",
      slug: "طراحی زیبا و کیفیت عالی",
      category: "مبل",
      description: "طراحی زیبا و کیفیت عالی",
      images: ["/images/products/p1.jpg", "/images/products/p2.jpg"],
      price: 5_000_000,
      brand: "Polo",
      rating: 4.5,
      numReviews: 10,
      stock: 5,
      isFeatured: true,
      banner: "banner-1.jpg",
    },
    {
      id: 2,
      name: "مبل مدرن",
      slug: "طراحی زیبا و کیفیت عالی",
      category: "مبل",
      description: "طراحی زیبا و کیفیت عالی",
      images: ["/images/products/p1.jpg", "/images/products/p2.jpg"],
      price: 5_000_000,
      brand: "Polo",
      rating: 4.5,
      numReviews: 10,
      stock: 0,
      isFeatured: true,
      banner: "banner-1.jpg",
    },
    {
      id: 3,
      name: "مبل مدرن",
      slug: "طراحی زیبا و کیفیت عالی",
      category: "مبل",
      description: "طراحی زیبا و کیفیت عالی",
      images: ["/images/products/p3.jpg", "/images/products/p4.jpg"],
      price: 10_000_000,
      brand: "Polo",
      rating: 4.5,
      numReviews: 10,
      stock: 10,
      isFeatured: true,
      banner: "banner-1.jpg",
    },
    {
      id: 4,
      name: "مبل مدرن",
      slug: "طراحی زیبا و کیفیت عالی",
      category: "مبل",
      description: "طراحی زیبا و کیفیت عالی",
      images: ["/images/products/p1.jpg", "/images/products/p2.jpg"],
      price: 6_000_000,
      brand: "Polo",
      rating: 4.5,
      numReviews: 10,
      stock: 5,
      isFeatured: true,
      banner: "banner-1.jpg",
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
