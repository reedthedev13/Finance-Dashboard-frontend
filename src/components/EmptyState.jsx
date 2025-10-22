const EmptyState = ({ message = "No data yet.", icon = "💰" }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <div className="text-5xl mb-3">{icon}</div>
      <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
        {message}
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
        Add your first transaction to get started.
      </p>
    </div>
  );
};

export default EmptyState;
