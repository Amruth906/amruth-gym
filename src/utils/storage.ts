import { WorkoutSession } from '../types/workout';

const STORAGE_KEY = 'workout_sessions';

export const saveWorkoutSession = (session: WorkoutSession): void => {
  try {
    const existingSessions = getWorkoutSessions();
    const updatedSessions = [...existingSessions, session];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
  } catch (error) {
    console.error('Error saving workout session:', error);
  }
};

export const getWorkoutSessions = (): WorkoutSession[] => {
  try {
    const sessions = localStorage.getItem(STORAGE_KEY);
    return sessions ? JSON.parse(sessions) : [];
  } catch (error) {
    console.error('Error loading workout sessions:', error);
    return [];
  }
};

export const getWorkoutSessionsByDate = (date: string): WorkoutSession[] => {
  const sessions = getWorkoutSessions();
  return sessions.filter(session => session.date === date);
};

export const deleteWorkoutSession = (sessionId: string): void => {
  try {
    const sessions = getWorkoutSessions();
    const updatedSessions = sessions.filter(session => session.id !== sessionId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
  } catch (error) {
    console.error('Error deleting workout session:', error);
  }
};

export const getWorkoutStats = () => {
  const sessions = getWorkoutSessions();
  const totalSessions = sessions.length;
  const totalCalories = sessions.reduce((sum, session) => sum + session.totalCalories, 0);
  const totalWorkoutTime = sessions.reduce((sum, session) => sum + session.totalDuration, 0);
  const averageCaloriesPerSession = totalSessions > 0 ? Math.round(totalCalories / totalSessions) : 0;
  
  return {
    totalSessions,
    totalCalories,
    totalWorkoutTime,
    averageCaloriesPerSession
  };
};