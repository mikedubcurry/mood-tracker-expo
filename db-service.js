import { openDatabase } from "expo-sqlite";

function getDatabase() {
    return openDatabase('moods-app.db', '0.0.4');
}

export const db = getDatabase();
