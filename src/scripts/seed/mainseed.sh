export MONGODB_URI="mongodb://root:root@localhost:27017/questionbankpro?authSource=admin"

npx tsx educationLevel.seed.ts 
npx tsx exam.seed.ts 
npx tsx course.seed.ts 
npx tsx syllabus.seed.ts
npx tsx seed-gate-cs-it-syllabus.seed