import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types';

const TASKS_STORAGE_KEY = '@TaskManager:tasks';

export const useTaskStorage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
        if (storedTasks) {
          const parsedTasks = JSON.parse(storedTasks).map((task: any) => ({
            ...task,
            dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
          }));
          console.log('Loaded tasks:', parsedTasks);
          setTasks(parsedTasks);
        }
      } catch (e) {
        console.error('Failed to load tasks.', e);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  useEffect(() => {
    const saveTasks = async () => {
      if (!loading) {
        try {
          const tasksToSave = tasks.map(task => ({
            ...task,
            dueDate: task.dueDate instanceof Date ? task.dueDate.toISOString() : task.dueDate,
          }));
          console.log('Saving tasks:', tasksToSave);
          await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasksToSave));
        } catch (e) {
          console.error('Failed to save tasks.', e);
        }
      }
    };
    saveTasks();
  }, [tasks]);

  return { tasks, setTasks, loading };
}; 