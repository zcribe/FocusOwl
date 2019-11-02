import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import WorkController from "./timecontroller/WorkController";
import BreakController from "./timecontroller/BreakController";

const styles = StyleSheet.create({
    flex:{
        flex: 1,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'space-around'
    }
})

class TimerController extends Component {
    render() {
        return (
            <View style={styles.flex}>
                <WorkController/>
                <BreakController/>
            </View>
        );
    }
}

export default TimerController;