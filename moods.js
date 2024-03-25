import { db } from "./db-service";

export function getMoodActivities(mood) {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(`select * from moodActivities where moodId = ?;`, [mood.id,], (t, { rows }) => {
                const moodActivities = rows._array;
                const params = moodActivities.map(ma => ma.activityId)
                const qMarks = moodActivities.map(() => "?").join(', ')
                if (moodActivities) {
                    t.executeSql(`select * from activities where id in (${qMarks});`, params, (_, { rows }) => {
                        const acts = rows._array
                        resolve(acts)
                    })
                } else {
                    resolve([])
                }
            })
        })

    })
}

export function getMoodNote(mood) {
    return new Promise((resolve) => {
        db.transaction(tx => {
            tx.executeSql(`select * from moodNotes where moodId = ?;`, [mood.id], (_, { rows }) => {
                if (rows._array.length) {
                    resolve(rows._array[0])
                } else {
                    resolve([])
                }
            })

        })
    })

}
