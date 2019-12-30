import React, {Component, PureComponent} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import ProgressCircle from 'react-native-progress-circle'


class TimerCounter extends PureComponent {

    render() {
        let color, shadowColor, bgColor;
        const screenWidth = Math.round(Dimensions.get('window').width)
        const radius = screenWidth / 4;
        const border = screenWidth / 24;
        const text = screenWidth / 15;

        // Change the colors depending on the timer type
        if (this.props.counterType === 'work') {
            color = "#8293FF"
            shadowColor = "#E1E4F3"
            bgColor = "#1A2640"
        } else {
            color = "#C6FF82"
            shadowColor = "#E1E4F3"
            bgColor = "#27401a"
        }

        return (
            <View>

                <ProgressCircle
                    percent={this.props.percentage}
                    radius={radius}
                    borderWidth={border}
                    color={color}
                    shadowColor={shadowColor}
                    bgColor={bgColor}
                >
                    <Text style={{
                        fontSize: text,
                        color: '#E1E4F3'
                    }} >{`${this.props.minutes} : ${this.props.seconds}`}</Text>
                </ProgressCircle>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {}
})


export default TimerCounter;