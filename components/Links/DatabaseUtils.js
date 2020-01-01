import * as SQLite from "expo-sqlite";
import {DB_NAME, SECONDS_IN_MINUTE} from "../Constants"
import {objArrToArr} from "./DataTransformUtils";

const DB = SQLite.openDatabase(DB_NAME);

export default async function readData() {
    // Reads the data in from DB that is needed for graph generation

    let today, week, three_months;
    // READ TODAY
    DB.transaction(tx => {
        tx.executeSql(`
                    SELECT workMinutes
                    FROM days
                    WHERE date = DATE('now')`,
            null,
            (trans, res) => {
                console.log(trans,res)
                if (res['rows']['length'] > 0) {
                    // Old
                    // let totalMinutes = res['rows']['_array'][0]['workMinutes']
                    // this.setState({
                    //     totalMinutes: totalMinutes
                    // })
                     today = res['rows']['_array'][0]['workMinutes'];

                }
            })
    }, null, (_, res)=>{console.log(res)});
    // READ WEEK
    // DB.transaction(tx => {
    //     tx.executeSql(`
    //                 SELECT workMinutes
    //                 FROM days
    //                 WHERE date BETWEEN DATE('now', '-7 day') and DATE('now')`,
    //         null,
    //         (trans, res) => {
    //             // let weekMinutes = this.objArrToArr(res['rows']['_array'])
    //             // this.setState({
    //             //     weekMinutes: weekMinutes
    //             // })
    //             week = this.objArrToArr(res['rows']['_array'])
    //         })
    // },);
    // READ THREE MONTHS
    // DB.transaction(tx => {
    //     tx.executeSql(`
    //                 SELECT workCount AS count, date
    //                 FROM days
    //                 WHERE date BETWEEN DATE('now', '-90 day') and DATE('now')`,
    //         null,
    //         (trans, res) => {
    //
    //             // this.setState({
    //             //     threeMonthsCounts: res['rows']['_array']
    //             // })
    //             three_months = this.objArrToArr(res['rows']['_array'])
    //
    //
    //         }
    //     )
    // }, (e) => {
    //     console.log(e)
    // }, (e, result) => {
    //     console.log(result)
    // });

    return {today, week, three_months}
}