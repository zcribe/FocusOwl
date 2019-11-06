import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ProgressCircle from 'react-native-progress-circle'


class TimerCounter extends Component {
    render() {
        return (
            <View>

                <ProgressCircle
                    percent={this.props.percentage}
                    radius={100}
                    borderWidth={15}
                    color="#8293FF"
                    shadowColor="#E1E4F3"
                    bgColor="#1A2640"
                >
                    <Text style={styles.title}>{`${this.props.minutes} : ${this.props.seconds}`}</Text>
                </ProgressCircle>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        color: '#E1E4F3'
    }
})


export default TimerCounter;