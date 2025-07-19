export default function SkillGapCard({ skillName, onShowCourses, onMarkAsLearned }) {
    return (
        <div className="p-6 max-w-[400px] border border-gray-200 rounded-lg bg-gray-100 hover:bg-gray-200 transition shadow-sm flex flex-col justify-between">
            <div className="text-xl font-semibold text-gray-900">
                {skillName}
            </div>
            <div className="flex gap-2 mt-4">
                <button onClick={onShowCourses} className="text-sm bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200 transition">
                    📘 Explore Courses
                </button>
                <button onClick={onMarkAsLearned} className="text-sm bg-green-100 text-green-800 px-4 py-2 rounded-lg hover:bg-green-200 transition">
                    ✅ Mark as Learned
                </button>
            </div>
        </div>
    );
}

