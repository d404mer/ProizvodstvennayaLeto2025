import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskHistoryRecord } from '../types';

const HISTORY_STORAGE_KEY = '@TaskManager:history';

export const useTaskHistory = () => {
  const [history, setHistory] = useState<TaskHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const stored = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
        if (stored) {
          setHistory(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load history.', e);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    const saveHistory = async () => {
      if (!loading) {
        try {
          await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
        } catch (e) {
          console.error('Failed to save history.', e);
        }
      }
    };
    saveHistory();
  }, [history]);

  const addHistoryRecord = (record: TaskHistoryRecord) => {
    setHistory(prev => [record, ...prev]);
  };

  return { history, addHistoryRecord, loading };
}; 