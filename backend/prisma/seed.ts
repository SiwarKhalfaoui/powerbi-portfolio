import { PrismaClient, Availability } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hashPassword('Password123');

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@drd-portfolio.com' },
    update: {},
    create: {
      email: 'demo@drd-portfolio.com',
      passwordHash,
      firstName: 'Mohamed Aziz',
      lastName: 'Najar',
      professionalTitle: 'Power BI Developer & Data Analyst',
      bio: 'Passionate about turning raw data into decisions. Building interactive Power BI dashboards for finance and retail.',
      country: 'Tunisia',
      city: 'Tunis',
      languages: ['French', 'English', 'Arabic'],
      skills: ['Power BI', 'DAX', 'Power Query', 'SQL', 'Excel', 'Microsoft Fabric'],
      availability: Availability.FREELANCE,
      linkedinUrl: 'https://linkedin.com/in/example',
      githubUrl: 'https://github.com/example',
      isEmailVerified: true,
    },
  });

  console.log('✅ Seeded demo user:', demoUser.email, '(password: Password123)');
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
