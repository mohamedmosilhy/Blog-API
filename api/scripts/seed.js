require("dotenv").config();

const prisma = require("../lib/prisma");

async function main() {
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: "mariam.hassan",
        email: "mariam.hassan@example.com",
        password: "password123",
        role: "AUTHOR",
      },
    }),
    prisma.user.create({
      data: {
        username: "ahmed.saleh",
        email: "ahmed.saleh@example.com",
        password: "password123",
        role: "AUTHOR",
      },
    }),
    prisma.user.create({
      data: {
        username: "sara.ali",
        email: "sara.ali@example.com",
        password: "password123",
        role: "USER",
      },
    }),
    prisma.user.create({
      data: {
        username: "youssef.mahdy",
        email: "youssef.mahdy@example.com",
        password: "password123",
        role: "USER",
      },
    }),
  ]);

  const [mariam, ahmed, sara, youssef] = users;

  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: "How to Structure a Clean Express API",
        content:
          "A practical guide to keeping controllers thin, moving business logic into services, and validating inputs before they hit your database.",
        published: true,
        authorId: mariam.id,
      },
    }),
    prisma.post.create({
      data: {
        title: "Why Prisma Makes Database Work Easier",
        content:
          "Prisma gives you a type-safe data layer, predictable migrations, and a better developer experience than raw SQL for most CRUD apps.",
        published: true,
        authorId: ahmed.id,
      },
    }),
    prisma.post.create({
      data: {
        title: "Building Better Seed Data for Development",
        content:
          "Seed data should look realistic enough to exercise your UI, routes, and relations without feeling like placeholder demo content.",
        published: false,
        authorId: mariam.id,
      },
    }),
    prisma.post.create({
      data: {
        title: "Common Mistakes When Handling IDs in Express",
        content:
          "Always validate route params and request body IDs before passing them to Prisma so invalid values become 400 errors instead of 500s.",
        published: true,
        authorId: ahmed.id,
      },
    }),
  ]);

  await prisma.comment.createMany({
    data: [
      {
        content:
          "This is exactly the kind of structure I was looking for. The controller example is clear and practical.",
        postId: posts[0].id,
        userId: sara.id,
      },
      {
        content:
          "Great breakdown. I especially like the validation-first approach before touching Prisma.",
        postId: posts[0].id,
        userId: youssef.id,
      },
      {
        content:
          "Prisma really does simplify a lot of the repetitive database work in CRUD APIs.",
        postId: posts[1].id,
        userId: mariam.id,
      },
      {
        content:
          "Would love to see a follow-up about relations and pagination in Prisma.",
        postId: posts[1].id,
        userId: sara.id,
      },
      {
        content:
          "This is useful for anyone setting up a development database with real-looking content.",
        postId: posts[2].id,
        userId: ahmed.id,
      },
      {
        content:
          "The ID validation advice saved me from a similar bug last week.",
        postId: posts[3].id,
        userId: youssef.id,
      },
    ],
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
