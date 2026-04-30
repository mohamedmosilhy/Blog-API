require("dotenv").config();

const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");

const SEED_CONFIG = {
  authors: 10,
  users: 40,
  posts: 180,
  comments: 1200,
};

const samplePostTopics = [
  "Express API design",
  "Prisma query patterns",
  "Database indexing basics",
  "Route-level authorization",
  "Pagination strategies",
  "Error handling in Node",
  "Validation with middleware",
  "Testing REST endpoints",
  "Rate limiting best practices",
  "Refactoring controllers",
];

const sampleCommentPhrases = [
  "This was very useful, thank you!",
  "I applied this and it improved my endpoint behavior.",
  "Clear explanation. Would love a deeper example next.",
  "Great write-up and practical tips.",
  "This saved me from a bug in production-like testing.",
  "Nice breakdown. The structure is easy to follow.",
  "I had the same issue, this approach fixed it for me.",
  "Helpful guide, especially the validation part.",
  "Can you add a sequel focused on performance tuning?",
  "Excellent overview with realistic examples.",
];

const pick = (items, index) => items[index % items.length];

const buildUsers = (passwordHash) => {
  const baseUsers = [
    {
      username: "mariam.hassan",
      email: "mariam.hassan@example.com",
      password: passwordHash,
      role: "AUTHOR",
    },
    {
      username: "ahmed.saleh",
      email: "ahmed.saleh@example.com",
      password: passwordHash,
      role: "AUTHOR",
    },
    {
      username: "sara.ali",
      email: "sara.ali@example.com",
      password: passwordHash,
      role: "USER",
    },
    {
      username: "youssef.mahdy",
      email: "youssef.mahdy@example.com",
      password: passwordHash,
      role: "USER",
    },
  ];

  const generatedAuthors = Array.from(
    { length: SEED_CONFIG.authors },
    (_, index) => {
      const number = index + 1;
      return {
        username: `author${number}`,
        email: `author${number}@example.com`,
        password: passwordHash,
        role: "AUTHOR",
      };
    },
  );

  const generatedUsers = Array.from(
    { length: SEED_CONFIG.users },
    (_, index) => {
      const number = index + 1;
      return {
        username: `user${number}`,
        email: `user${number}@example.com`,
        password: passwordHash,
        role: "USER",
      };
    },
  );

  return [...baseUsers, ...generatedAuthors, ...generatedUsers];
};

const buildPosts = (authors) =>
  Array.from({ length: SEED_CONFIG.posts }, (_, index) => {
    const topic = pick(samplePostTopics, index);
    const author = authors[index % authors.length];
    const postNumber = index + 1;

    return {
      title: `${topic} #${postNumber}`,
      content:
        `Post ${postNumber}: A concise walkthrough of ${topic.toLowerCase()} for practical backend workflows. ` +
        "It includes implementation notes, common pitfalls, and production-minded tips.",
      published: postNumber % 4 !== 0,
      authorId: author.id,
    };
  });

const buildComments = (posts, users) =>
  Array.from({ length: SEED_CONFIG.comments }, (_, index) => {
    const post = posts[index % posts.length];
    const user = users[(index * 7) % users.length];
    const phrase = pick(sampleCommentPhrases, index);

    return {
      content: `Comment ${index + 1}: ${phrase}`,
      postId: post.id,
      userId: user.id,
    };
  });

async function main() {
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Reset sequences in PostgreSQL
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "User_id_seq" RESTART WITH 1`);
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Post_id_seq" RESTART WITH 1`);
  await prisma.$executeRawUnsafe(
    `ALTER SEQUENCE "Comment_id_seq" RESTART WITH 1`,
  );

  const passwordHash = await bcrypt.hash("123456", 10);
  const usersToCreate = buildUsers(passwordHash);

  await prisma.user.createMany({ data: usersToCreate });

  const users = await prisma.user.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      role: true,
    },
  });

  const authors = users.filter((user) => user.role === "AUTHOR");

  const postsToCreate = buildPosts(authors);
  await prisma.post.createMany({ data: postsToCreate });

  const posts = await prisma.post.findMany({
    orderBy: { id: "asc" },
    select: { id: true },
  });

  const commentsToCreate = buildComments(posts, users);
  await prisma.comment.createMany({ data: commentsToCreate });

  console.log("Seed completed successfully.");
  console.log(
    `Created ${users.length} users, ${posts.length} posts, and ${commentsToCreate.length} comments.`,
  );
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
