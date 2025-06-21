import {
  ref,
  set,
  get,
  push,
  remove,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { db } from "../firebase";
import { WorkoutSession } from "../types/workout";
import { auth } from "../firebase";

// Get the current user's ID for database path
const getUserId = (): string | null => {
  const uid = auth.currentUser?.uid || null;
  if (!uid) {
    console.warn("[FirebaseStorage] No authenticated user found!");
  } else {
    console.log("[FirebaseStorage] User authenticated:", uid);
  }
  return uid;
};

// Get the database reference for the current user's workout sessions
const getUserWorkoutRef = () => {
  const userId = getUserId();
  if (!userId) {
    throw new Error("[FirebaseStorage] User not authenticated");
  }
  return ref(db, `users/${userId}/workoutSessions`);
};

export const saveWorkoutSession = async (
  session: WorkoutSession
): Promise<void> => {
  try {
    console.log("[FirebaseStorage] Starting saveWorkoutSession...");
    const userId = getUserId();
    if (!userId) {
      throw new Error("[FirebaseStorage] User not authenticated");
    }
    console.log(
      "[FirebaseStorage] Saving workout session for user:",
      userId,
      session
    );

    // Use the session ID as the key, or generate a new one if it doesn't exist
    const sessionRef = session.id
      ? ref(db, `users/${userId}/workoutSessions/${session.id}`)
      : push(ref(db, `users/${userId}/workoutSessions`));

    console.log(
      "[FirebaseStorage] Database reference created:",
      sessionRef.toString()
    );

    await set(sessionRef, {
      ...session,
      id: sessionRef.key || session.id,
      userId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log(
      "[FirebaseStorage] Workout session saved to Firebase successfully"
    );
  } catch (error: any) {
    console.error(
      "[FirebaseStorage] Error saving workout session to Firebase:",
      error
    );
    console.error("[FirebaseStorage] Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    throw error;
  }
};

export const getWorkoutSessions = async (): Promise<WorkoutSession[]> => {
  try {
    console.log("[FirebaseStorage] Starting getWorkoutSessions...");
    const userId = getUserId();
    if (!userId) {
      console.warn("[FirebaseStorage] getWorkoutSessions: No userId");
      return [];
    }
    console.log("[FirebaseStorage] Loading workout sessions for user:", userId);
    const sessionsRef = ref(db, `users/${userId}/workoutSessions`);
    console.log(
      "[FirebaseStorage] Database reference:",
      sessionsRef.toString()
    );

    const snapshot = await get(sessionsRef);
    console.log("[FirebaseStorage] Snapshot received:", snapshot.exists());

    if (snapshot.exists()) {
      const sessions: WorkoutSession[] = [];
      snapshot.forEach((childSnapshot) => {
        sessions.push(childSnapshot.val());
      });
      console.log("[FirebaseStorage] Loaded sessions:", sessions);
      return sessions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }

    console.log("[FirebaseStorage] No sessions found");
    return [];
  } catch (error: any) {
    console.error(
      "[FirebaseStorage] Error loading workout sessions from Firebase:",
      error
    );
    console.error("[FirebaseStorage] Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    return [];
  }
};

export const getWorkoutSessionsByDate = async (
  date: string
): Promise<WorkoutSession[]> => {
  try {
    const userId = getUserId();
    if (!userId) {
      return [];
    }
    console.log(
      "[FirebaseStorage] Loading workout sessions by date for user:",
      userId,
      date
    );
    const sessionsRef = ref(db, `users/${userId}/workoutSessions`);
    const dateQuery = query(sessionsRef, orderByChild("date"), equalTo(date));
    const snapshot = await get(dateQuery);

    if (snapshot.exists()) {
      const sessions: WorkoutSession[] = [];
      snapshot.forEach((childSnapshot) => {
        sessions.push(childSnapshot.val());
      });
      return sessions;
    }

    return [];
  } catch (error) {
    console.error(
      "[FirebaseStorage] Error loading workout sessions by date from Firebase:",
      error
    );
    return [];
  }
};

export const deleteWorkoutSession = async (
  sessionId: string
): Promise<void> => {
  try {
    const userId = getUserId();
    if (!userId) {
      throw new Error("[FirebaseStorage] User not authenticated");
    }
    console.log(
      "[FirebaseStorage] Deleting workout session for user:",
      userId,
      sessionId
    );
    const sessionRef = ref(db, `users/${userId}/workoutSessions/${sessionId}`);
    await remove(sessionRef);
    console.log("[FirebaseStorage] Workout session deleted from Firebase");
  } catch (error) {
    console.error(
      "[FirebaseStorage] Error deleting workout session from Firebase:",
      error
    );
    throw error;
  }
};

export const getWorkoutStats = async () => {
  try {
    const sessions = await getWorkoutSessions();
    const totalSessions = sessions.length;
    const totalCalories = sessions.reduce(
      (sum, session) => sum + session.totalCalories,
      0
    );
    const totalWorkoutTime = sessions.reduce(
      (sum, session) => sum + session.totalDuration,
      0
    );
    const averageCaloriesPerSession =
      totalSessions > 0 ? Math.round(totalCalories / totalSessions) : 0;

    return {
      totalSessions,
      totalCalories,
      totalWorkoutTime,
      averageCaloriesPerSession,
    };
  } catch (error) {
    console.error(
      "[FirebaseStorage] Error getting workout stats from Firebase:",
      error
    );
    return {
      totalSessions: 0,
      totalCalories: 0,
      totalWorkoutTime: 0,
      averageCaloriesPerSession: 0,
    };
  }
};

// Migration function to move data from localStorage to Firebase
export const migrateFromLocalStorage = async (): Promise<void> => {
  try {
    const userId = getUserId();
    if (!userId) {
      console.log(
        "[FirebaseStorage] User not authenticated, skipping migration"
      );
      return;
    }
    // Import the old storage functions
    const { getWorkoutSessions: getLocalSessions } = await import("./storage");
    const localSessions = getLocalSessions();
    if (localSessions.length === 0) {
      console.log("[FirebaseStorage] No local sessions to migrate");
      return;
    }
    console.log(
      `[FirebaseStorage] Migrating ${localSessions.length} sessions from localStorage to Firebase...`
    );
    for (const session of localSessions) {
      await saveWorkoutSession(session);
    }
    console.log("[FirebaseStorage] Migration completed successfully");
  } catch (error) {
    console.error("[FirebaseStorage] Error during migration:", error);
  }
};

// Cleanup function to remove all workout data for the current user
export const clearAllWorkoutData = async (): Promise<void> => {
  try {
    const userId = getUserId();
    if (!userId) {
      throw new Error("[FirebaseStorage] User not authenticated");
    }

    console.log(
      "[FirebaseStorage] Clearing all workout data for user:",
      userId
    );

    // Get all sessions first
    const sessions = await getWorkoutSessions();
    console.log(
      `[FirebaseStorage] Found ${sessions.length} sessions to delete`
    );

    // Delete each session
    for (const session of sessions) {
      await deleteWorkoutSession(session.id);
      console.log(`[FirebaseStorage] Deleted session: ${session.id}`);
    }

    // Also clear localStorage as backup
    const {
      getWorkoutSessions: getLocalSessions,
      deleteWorkoutSession: deleteLocalSession,
    } = await import("./storage");
    const localSessions = getLocalSessions();
    for (const session of localSessions) {
      deleteLocalSession(session.id);
    }

    console.log("[FirebaseStorage] All workout data cleared successfully");
  } catch (error) {
    console.error("[FirebaseStorage] Error clearing workout data:", error);
    throw error;
  }
};
