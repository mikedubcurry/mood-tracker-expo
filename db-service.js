import { openDatabase, } from "expo-sqlite";
import { Mood } from "./moods";

const version = 1;

export const getDbConnection = () => {
    return openDatabase('mood-app', version)
}

export const createTables = async (db) => {
    const query = `
        CREATE TABLE IF NOT EXISTS moods (id INT NOT NULL AUTOINCREMENT, date TEXT NOT NULL, mood INT NOT NULL);
        CREATE TABLE IF NOT EXISTS activities (id INT NOT NULL AUTOINCREMENT, activity TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS moodActivities (id INT NOT NULL AUTOINCREMENT, moodId INT NOT NULL, activityId INT NOT NULL);
    `
    await db.executeSql(query);
}

export const createMood = (mood, activityIds) => {
    const moodQuery = `
        INSERT INTO moods (date, mood) VALUES (${new Date().toISOString()}, ${mood});
    `
    
}
