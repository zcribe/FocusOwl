import * as SQLite from "expo-sqlite";
import {DB_NAME, SECONDS_IN_MINUTE} from "../Constants"

const DB = SQLite.openDatabase(DB_NAME);

// Initial Table creations
export function createDaysTable() {
    DB.transaction(
        tx => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS days
                           (
                               date        DATE UNIQUE NOT NULL,
                               workMinutes INTEGER,
                               workCount   INTEGER,
                               restMinutes INTEGER,
                               restCount   INTEGER
                           )`)
        }, (t, error) => {
            console.log(error)
        }
    );
};

export function createSessionsTable() {
    DB.transaction(
        tx => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS sessions
                           (
                               date   DATE UNIQUE NOT NULL,
                               type   TEXT,
                               length INTEGER
                           )`)
        }, (t, error) => {
            console.log(error)
        }
    )
};

// Create
export function createDaysEntry() {
    try {
        createDaysTable();
        DB.transaction(tx => {
                tx.executeSql(`
                    INSERT OR IGNORE INTO days
                    VALUES (DATE('now'), ?, ?, ?, ?)`, [0, 0, 0, 0])
            }, (t, error) => {
                console.log(error)
            }
        )
    } catch (error) {
        console.log(error)
    }
};

export function createSessionsEntry(counterType, counter) {
    const type = counterType;
    const length = Math.round(counter / SECONDS_IN_MINUTE)

    try {
        createSessionsTable();
        DB.transaction(
            tx => {
                tx.executeSql(`
                    INSERT INTO sessions
                    VALUES (DATE('now'), ?, ?)`, [type, length])
            }, (t, error) => {
                console.log(error)
            }
        )
    } catch (error) {
        console.log(error)
    }
};

// Read
export function readDaysTable() {
    try {
        DB.transaction(
            tx => {
                tx.executeSql(`SELECT *
                               FROM days`)
            }, (t, error) => {
                console.log(error)
            }
        );
    } catch (e) {
        console.log(e)
    }
};

export function readDaysEntry() {
    // READ TODAY
    try {
        DB.transaction(tx => {
            tx.executeSql(`
                        SELECT workMinutes
                        FROM days
                        WHERE date = DATE('now')`,
                null,
                (trans, res) => {

                    if (res['rows']['length'] > 0) {
                        let totalMinutes = res['rows']['_array'][0]['workMinutes']
                        this.setState({
                            totalMinutes: totalMinutes
                        })
                    }
                }), (t, error) => {
                console.log(error);
            }
        });
    } catch (e) {
        console.log(e)
    }
};

// Update
export function updateDaysEntry(counterType, counter) {
    try {
        let minutes;
        if (counterType === 'work') {
            minutes = Math.round(counter / 60);
            DB.transaction(
                tx => {
                    tx.executeSql(`
                        UPDATE days
                        SET workMinutes = workMinutes + ?,
                            workCount   = workCount + 1
                        WHERE DATE = DATE('now')`, [minutes])
                }, (t, error) => {
                    console.log(error);
                }
            )
        } else {
            minutes = Math.round(counter / 60);
            DB.transaction(
                tx => {
                    tx.executeSql(`
                        UPDATE days
                        SET restMinutes = restMinutes + ?,
                            restCount   = restCount + 1
                        WHERE DATE = DATE('now')`, [minutes])
                }, (t, error) => {
                    console.log(error)
                }
            )
        }
    } catch (e) {
        console.log(e)

    }
};