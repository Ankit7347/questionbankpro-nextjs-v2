import Link from 'next/link';

export default function QuizHistory() {
  const history = [
    { id: '101', title: 'Organic Chemistry', score: 85, date: '2023-10-01', passed: true },
    { id: '102', title: 'Mechanics', score: 40, date: '2023-09-28', passed: false },
    { id: '103', title: 'Modern History', score: 92, date: '2023-09-25', passed: true },
  ];

  return (
    <div className="p-4 space-y-4 mx-auto">
      <div className="flex items-center mb-4">
        <Link href="/dashboard/quiz" className="mr-4 text-gray-600">← Back</Link>
        <h1 className="text-xl font-bold">Quiz History</h1>
      </div>
      
      {/* Trend Graph Placeholder */}
      <div className="bg-white border rounded-xl p-4 h-40 flex flex-col items-center justify-center text-gray-400 mb-6 shadow-sm">
        <span className="text-sm mb-2">Performance Trend (Last 10)</span>
        <div className="w-full h-24 bg-gray-50 rounded flex items-end justify-around px-2 pb-2">
           {/* Mock bars */}
           {[40, 60, 55, 70, 85, 65, 90, 78, 85, 92].map((h, i) => (
             <div key={i} className="w-2 bg-indigo-400 rounded-t" style={{ height: `${h}%` }}></div>
           ))}
        </div>
      </div>

      <div className="space-y-3">
        {history.map((item) => (
          <div key={item.id} className="bg-white border rounded-xl p-4 shadow-sm flex justify-between items-center hover:shadow-md transition">
            <div>
              <h3 className="font-semibold text-gray-800">{item.title}</h3>
              <div className="text-xs text-gray-500 mt-1">{item.date}</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="font-bold text-lg text-gray-900">{item.score}%</div>
                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${item.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {item.passed ? 'Pass' : 'Fail'}
                </span>
              </div>
              <Link href={`/dashboard/quiz/${item.id}/result`} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}