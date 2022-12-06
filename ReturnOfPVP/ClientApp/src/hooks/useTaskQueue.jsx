import { useCallback, useEffect, useState } from "react";

export default function useTaskQueue(shouldProcess) {
  const [queue, setQueue] = useState({ isProcessing: false, tasks: [] });

  useEffect(() => {
    if (!shouldProcess) return;
    if (queue.tasks.length === 0) return;
    if (queue.isProcessing) return;

    const task = queue.tasks[0];
    setQueue((prev) => ({
      isProcessing: true,
      tasks: prev.tasks.slice(1),
    }));

    Promise.resolve(task()).finally(() => {
      setQueue((prev) => ({
        isProcessing: false,
        tasks: prev.tasks,
      }));
    });
  }, [queue, shouldProcess]);

  return {
    tasks: queue.tasks,
    isProcessing: queue.isProcessing,
    addTask: useCallback((task) => {
      setQueue((prev) => ({
        isProcessing: prev.isProcessing,
        tasks: [...prev.tasks, task],
      }));
    }, []),
  };
}
