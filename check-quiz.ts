import mongoose from 'mongoose';
import Quiz from '@/models/mongoose/Quiz.schema';

const MONGODB_URI = 'mongodb://root:root@localhost:27017/questionbankpro?authSource=admin';

async function checkQuiz() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    console.log('Checking for quizzes...\n');
    const quizzes = await (Quiz as any).find({}, { _id: 1, title: 1, isPublished: 1, isDeleted: 1 }).limit(10);
    console.log('Found quizzes:');
    quizzes.forEach((q: any) => {
      console.log(`  • ${q._id}: ${q.title?.en || 'No title'} (published: ${q.isPublished}, deleted: ${q.isDeleted})`);
    });
    
    console.log('\nChecking specific quiz: 69901db705bc768b858e3be9');
    const quiz = await (Quiz as any).findById('69901db705bc768b858e3be9');
    if (quiz) {
      console.log(`  Found: ${quiz.title?.en}`);
      console.log(`  Published: ${quiz.isPublished}`);
      console.log(`  Deleted: ${quiz.isDeleted}`);
    } else {
      console.log('  Quiz not found');
    }
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkQuiz();
