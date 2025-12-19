// components/NoticeCard.jsx
import { motion } from "framer-motion";

const priorityStyles = {
  urgent: "border-red-500 bg-red-50",
  important: "border-orange-500 bg-orange-50",
  normal: "border-gray-200 bg-white",
};

export default function NoticeCard({ notice }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`border-l-4 p-4 rounded-lg shadow-sm ${
        priorityStyles[notice.priority]
      }`}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">{notice.title}</h3>
        {notice.isPinned && <span>📌</span>}
      </div>

      <p className="text-gray-700 mt-2">{notice.summary}</p>

      <p className="text-xs text-gray-500 mt-3">
        Published on {notice.publishAt}
      </p>
    </motion.div>
  );
}
