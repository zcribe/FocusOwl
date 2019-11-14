import * as SQLite from 'expo-sqlite';

const DB_NAME = 'sessionStore';
const DB = SQLite.openDatabase(DB_NAME);


export function createTables() {
    // Create sessions table
    DB.transaction(tx => {
        tx.executeSql(`
            CREATE TABLE sessions
            (
                date   DATE    NOT NULL,
                type   TEXT    NOT NULL,
                length INTEGER NOT NULL
            )`)
    })

    // Create day summary table
    DB.transaction(tx => {
        tx.executeSql(`
            CREATE TABLE days
            (
                date        DATE UNIQUE NOT NULL DEFAULT (DATE('now')),
                workMinutes INTEGER              DEFAULT (0),
                restMinutes INTEGER              DEFAULT (0),
                workCount   INTEGER              DEFAULT (0),
                restCount   INTEGER              DEFAULT (0)
            )`)
    })
}

export function createSessionEntry() {
    let length, type;

    // type = this.state.counterType;
    //
    // if (type === 'work') {
    //     length = this.state.counterWork
    // } else {
    //     length = this.state.counterRest
    // }

    type = 5;
    length = 5;

    DB.transaction(
        tx => {
            tx.executeSql(`
                INSERT INTO sessions
                VALUES (DATE('now'), ?, ?)`, [type, length])
        }
    )
}

export function readSessionEntry() {
    let length, type;

    // type = this.state.counterType;
    //
    // if (type === 'work') {
    //     length = this.state.counterWork
    // } else {
    //     length = this.state.counterRest
    // }

    type = 5;
    length = 5;

    DB.transaction(
        tx => {
            tx.executeSql(`
                        SELECT *
                        FROM sessions`,
                null,
                (trans, res) => {
                    console.log(res)
                })
        }
    )
}


export function createDaysEntry() {
    DB.transaction(tx => {
        tx.executeSql(`
            INSERT INTO days
            VALUES (DATE('now'), ?, ?, ?, ?)`, [5, 5, 5, 5])
    })
}

export function readData() {
    // READ TODAY
    DB.transaction(tx => {
        tx.executeSql(`
            SELECT workMinutes FROM days WHERE date = DATE ('now')`,
            null,
            (trans, res) => {
                    let totalMinutes = res['rows']['_array'][0]['workMinutes']
                    this.setState({
                        totalMinutes: totalMinutes
                    })

                })
    });

    // READ WEEK
    DB.transaction(tx => {
        tx.executeSql(`
                    SELECT totalWorkMinutes
                    FROM days
                    WHERE date BETWEEN DATE('now') AND DATE('now', '-7 day')`,
            null,
            (trans, res) => {
                console.log(res)
                this.setState({
                    weekMinutes: res
                })
            },
            e => console.log('ERROR:', e))
    }, null, (trans, res) => {
    });

    // READ THREE MONTHS
    DB.transaction(tx => {
        tx.executeSql(`
                    SELECT totalWorkCount
                    FROM days
                    WHERE date BETWEEN DATE('now') AND DATE('now', '-90 day')`,
            null,
            (trans, res) => {
                console.log(res)
                this.setState({
                    threeMonthsCounts: res
                })
            },
            e => console.log('ERROR:', e))
    }, null, (trans, res) => {
    });
}

export function updateDaysEntry() {
    let type, length, totalWorkMinutes, totalRestMinutes, totalWorkCount, totalRestCount;

    type = this.state.counterType;

    if (type === 'work') {
        length = this.state.counterWork
    } else {
        length = this.state.counterRest
    }

    DB.transaction(tx => {
        tx.executeSql(`
                    SELECT totalWorkMinutes, totalRestMinutes, totalWorkCount, totalRestCount
                    FROM days
                    WHERE date = DATE('now')`,
            null,
            (trans, res) => {
                console.log(res)
            })
    }, null, (trans, res) => {
        console.log(trans)
    })
}

export function readTodayMinutes() {
    DB.transaction(tx => {
        tx.executeSql(`
                    SELECT totalWorkMinutes
                    FROM days
                    WHERE date = DATE('now')`,
            null,
            (trans, res) => {
                console.log(res)
                this.setState({
                    totalMinutes: res
                })
            },
            e => console.log('ERROR:', e))
    }, null, (trans, res) => {
    })
}

export function readThisWeekMinutes() {
    DB.transaction(tx => {
        tx.executeSql(`
                    SELECT totalWorkMinutes
                    FROM days
                    WHERE date BETWEEN DATE('now') AND DATE('now', '-7 day')`,
            null,
            (trans, res) => {
                console.log(res)
                this.setState({
                    weekMinutes: res
                })
            },
            e => console.log('ERROR:', e))
    }, null, (trans, res) => {
    })
}

export function readThreeMonthsCounts() {
    DB.transaction(tx => {
        tx.executeSql(`
                    SELECT totalWorkCount
                    FROM days
                    WHERE date BETWEEN DATE('now') AND DATE('now', '-90 day')`,
            null,
            (trans, res) => {
                console.log(res)
                this.setState({
                    threeMonthsCounts: res
                })
            },
            e => console.log('ERROR:', e))
    }, null, (trans, res) => {
    })
}
