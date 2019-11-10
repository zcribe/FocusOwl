import React from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import {ContributionGraph, LineChart} from "react-native-chart-kit";



const commitsData = [
    {date: "2019-08-02", count: 1},
    {date: "2019-08-03", count: 2},
    {date: "2019-08-04", count: 3},
    {date: "2019-08-05", count: 4},
    {date: "2019-08-06", count: 5},
    {date: "2019-08-30", count: 2},
    {date: "2019-08-31", count: 3},
    {date: "2019-09-01", count: 2},
    {date: "2019-09-02", count: 4},
    {date: "2019-09-05", count: 2},
    {date: "2019-09-30", count: 4}
];
const screenWidth = Dimensions.get("window").width;

const chartConfig = {
    backgroundColor: "#E1E4F3",
    backgroundGradientFrom: "#3D4A76",
    backgroundGradientTo: "#3D4A76",
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {},
    propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#8293FF"
    }
}


export default function LinksScreen() {

    return (
        <ScrollView style={styles.container}>
            <View>
                <Text>200</Text>
                <Text>minutes of focusing</Text>
            </View>
            <Text>This week:</Text>
            <LineChart
                data={{
                    labels: ["Mon", "Tue", "Wen", "Thu", "Fri", "Sat", "Sun"],
                    datasets: [
                        {
                            data: [
                                200,
                                150,
                                600,
                                777,
                                432,
                                667
                            ]
                        }
                    ]
                }}
                width={screenWidth} // from react-native
                height={220}
                yAxisSuffix={"min"}
                chartConfig={chartConfig}
                bezier
                style={{
                    marginVertical: 8
                }}
            />
            <Text>Last three months:</Text>
            <ContributionGraph values={commitsData} endDate={new Date()}
                               numDays={105} width={screenWidth} height={220} chartConfig={chartConfig}/>
        </ScrollView>
    );
}

LinksScreen.navigationOptions = {
    title: 'Statistics',
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#fff',
    },
});
