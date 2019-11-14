import React, {Component} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import ProgressCircle from 'react-native-progress-circle'


class TimerCounter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            minutes: this.props.minutes,
            seconds: this.props.seconds,
            percentage: this.props.percentage
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.minutes !== this.props.minutes) {
            this.setState({minutes: this.props.minutes});
        }
    }


    render() {
        let color, shadowColor, bgColor;
        const screenWidth = Math.round(Dimensions.get('window').width)
        const radius = screenWidth / 4
        const border = screenWidth / 20
        const text = screenWidth / 15

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
                    percent={this.state.percentage}
                    radius={radius}
                    borderWidth={border}
                    color={color}
                    shadowColor={shadowColor}
                    bgColor={bgColor}
                >
                    <Text key={this.state.minutes} style={{
                        fontSize: text,
                        color: '#E1E4F3'
                    }}>{`${this.state.minutes} : ${this.state.seconds}`}</Text>
                </ProgressCircle>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {}
})


export default TimerCounter;