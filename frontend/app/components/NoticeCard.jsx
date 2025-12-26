// components/NoticeCard.jsx
import { motion } from "framer-motion";

export default function NoticeCard({ notice }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900 mb-2">{notice.title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {notice.description || notice.summary}
          </p>
        </div>
        {notice.isPinned && (
          <span className="text-amber-500 text-lg flex-shrink-0">📌</span>
        )}
      </div>

      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          {new Date(notice.createdAt || notice.publishAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
        {(notice.is_active === false || notice.isActive === false) && (
          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
            Inactive
          </span>
        )}
      </div>
    </motion.div>
  );
}
