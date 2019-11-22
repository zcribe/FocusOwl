import React, {Component} from 'react';
import {Dimensions, ImageBackground, ScrollView, StyleSheet, Text, View} from 'react-native';
import {ContributionGraph, LineChart} from "react-native-chart-kit";
import * as SQLite from "expo-sqlite";

const DB_NAME = 'sessionStore';
const DB = SQLite.openDatabase(DB_NAME);
const screenWidth = Dimensions.get("window").width;

const chartConfig = {
    backgroundColor: "#8293FF",
    backgroundGradientFrom: "#272F50",
    backgroundGradientTo: "#272F50",
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(52, 179, 254, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(225, 228, 243, ${opacity})`,
    style: {},
    propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#34B3FE"
    }
}


export default class LinksScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalMinutes: 0,
            weekMinutes: [0, 0, 0, 0, 0, 0, 0, 0],
            threeMonthsCounts: [{}]
        };

        this.readData = this.readData.bind(this);
        this.objArrToArr = this.objArrToArr.bind(this);
        this.generateDayLabels = this.generateDayLabels.bind(this);
        this.readData()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.readData()
    }

    objArrToArr(objArr) {
        // Helper method for converting array of objects to a simple array
        let outArr = [];
        for (let i = 0; i < objArr.length; i++) {
            outArr.push(objArr[i]["workMinutes"])
        }
        return outArr
    }

    generateDayLabels() {
        const todayDay = new Date().getDay()
        let labelNrArray = [todayDay - 6, todayDay - 5, todayDay - 4, todayDay - 3, todayDay - 2, todayDay - 1, todayDay]
        let labelNameArray = [];

        for (let i = 0; i < labelNrArray.length; i++) {
            let labelItem = labelNrArray[i];

            if (labelItem <= 0) {
                labelItem = labelItem + 7
            }

            if (labelItem === 1) {
                labelNameArray.push('Mon')
            } else if (labelItem === 2) {
                labelNameArray.push('Tue')
            } else if (labelItem === 3) {
                labelNameArray.push('Wen')
            } else if (labelItem === 4) {
                labelNameArray.push('Thu')
            } else if (labelItem === 5) {
                labelNameArray.push('Fri')
            } else if (labelItem === 6) {
                labelNameArray.push('Sat')
            } else if (labelItem === 7) {
                labelNameArray.push('Sun')
            }
        }

        return labelNameArray
    }

    readData() {
        // Reads the data in from DB that is needed for graph generation

        // READ TODAY
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
                })
        });

        // READ WEEK
        DB.transaction(tx => {
            tx.executeSql(`
                        SELECT workMinutes
                        FROM days
                        WHERE date BETWEEN DATE('now', '-7 day') and DATE('now')`,
                null,
                (trans, res) => {
                    let weekMinutes = this.objArrToArr(res['rows']['_array'])
                    this.setState({
                        weekMinutes: weekMinutes
                    })
                })
        }, );

        // READ THREE MONTHS
        DB.transaction(tx => {
            tx.executeSql(`
                        SELECT workCount AS count, date
                        FROM days
                        WHERE date BETWEEN DATE('now', '-90 day') and DATE('now')`,
                null,
                (trans, res) => {

                    this.setState({
                        threeMonthsCounts: res['rows']['_array']
                    })
                })
        });
    }

    render() {
        let data = {
            labels: this.generateDayLabels(),
            datasets: [
                {
                    data: this.state.weekMinutes
                }
            ]
        };


        return (
            <ImageBackground source={require('.././assets/images/6.jpg')} style={styles.bg}>
                <ScrollView style={styles.container}>
                    <View style={styles.containerDay}>
                        <Text style={styles.chartTitle}>Today</Text>
                        <Text style={styles.todayTotal}>
                            {this.state.totalMinutes}
                        </Text>
                        <Text style={styles.timeUnit}>min</Text>
                    </View>
                    <View style={styles.containerWeek}>
                        <Text style={styles.chartTitle}>Week</Text>
                        <LineChart
                            data={data}
                            width={screenWidth} // from react-native
                            height={220}
                            yAxisSuffix={"min"}
                            chartConfig={chartConfig}
                            bezier
                            style={{
                                marginVertical: 8
                            }}
                        />
                    </View>
                    <View style={styles.containerMonths}>
                        <Text style={styles.chartTitle}>Three months</Text>
                        <ContributionGraph values={this.state.threeMonthsCounts} endDate={new Date()}
                                           numDays={90} width={screenWidth} height={220} chartConfig={chartConfig}/>
                    </View>
                </ScrollView>
            </ImageBackground>
        );
    }
}

LinksScreen.navigationOptions = {
    title: 'Statistics',
    headerStyle: {
        backgroundColor: '#1A2640',
        color: '#E1E4F3'
    },
    headerTitleStyle: {
        color: '#E1E4F3'
    },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        // backgroundColor: '#1A2640',
    },
    containerDay: {
        backgroundColor: '#272F50',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 20,
        padding: 10,
        opacity: .8

    },
    containerWeek: {
        backgroundColor: '#272F50',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 20,
        padding: 10,
        opacity: .8

    },
    containerMonths: {
        backgroundColor: '#272F50',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 20,
        padding: 10,
        opacity: .8

    },
    todayTotal: {
        fontSize: 45,
        fontWeight: '700',
        color: '#34B3FE'
    },
    chartTitle: {
        color: '#e2eef3',
        fontWeight: '700'
    },
    timeUnit: {
        color: '#9FA6C9',
        fontSize: 10,
        fontWeight: '300'
    },
    bg: {
        flex: 1,
        resizeMode: 'stretch'
    },
});
