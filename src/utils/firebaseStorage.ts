import { ref, set, get, push, remove } from "firebase/database";
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
  } catch (error: unknown) {
    if (typeof error === "object" && error && "message" in error) {
      const err = error as { message?: string; code?: string; stack?: string };
      console.error(
        "[FirebaseStorage] Error saving workout session to Firebase:",
        err
      );
      console.error("[FirebaseStorage] Error details:", {
        message: err.message,
        code: err.code,
        stack: err.stack,
      });
      throw error;
    } else {
      console.error(
        "[FirebaseStorage] Unknown error saving workout session to Firebase:",
        error
      );
      throw error;
    }
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
  } catch (error: unknown) {
    if (typeof error === "object" && error && "message" in error) {
      const err = error as { message?: string; code?: string; stack?: string };
      console.error(
        "[FirebaseStorage] Error loading workout sessions from Firebase:",
        err
      );
      console.error("[FirebaseStorage] Error details:", {
        message: err.message,
        code: err.code,
        stack: err.stack,
      });
      return [];
    } else {
      console.error(
        "[FirebaseStorage] Unknown error loading workout sessions from Firebase:",
        error
      );
      return [];
    }
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
  } catch (error: unknown) {
    if (typeof error === "object" && error && "message" in error) {
      const err = error as { message?: string; code?: string; stack?: string };
      console.error(
        "[FirebaseStorage] Error loading workout sessions from Firebase:",
        err
      );
      console.error("[FirebaseStorage] Error details:", {
        message: err.message,
        code: err.code,
        stack: err.stack,
      });
      return [];
    } else {
      console.error(
        "[FirebaseStorage] Unknown error loading workout sessions from Firebase:",
        error
      );
      return [];
    }
  }
};

export const deleteWorkoutSession = async (
  sessionId: string
): Promise<void> => {
  const userId = getUserId();
  if (!userId) throw new Error("User not authenticated");
  const sessionRef = ref(db, `users/${userId}/workoutSessions/${sessionId}`);
  await remove(sessionRef);
};

export const clearAllWorkoutData = async (): Promise<void> => {
  const userId = getUserId();
  if (!userId) throw new Error("User not authenticated");
  const sessionsRef = ref(db, `users/${userId}/workoutSessions`);
  await remove(sessionsRef);
};
