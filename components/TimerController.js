import React, {Component} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';


const styles = StyleSheet.create({
    flex: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    flexColumn: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    }
})

class TimerController extends Component {




    render() {
        return (
            <View style={styles.flex}>

                <View style={styles.flexColumn}>
                    <Text>Work</Text>
                    <View style={styles.flex}>
                        <Button title="+" onPress={()=>this.props.incWork()}/>
                        <Text>{this.props.workTimer}</Text>
                        <Button title="-" onPress={()=>this.props.decWork()}/>
                    </View>
                </View>
                <View style={styles.flexColumn}>
                    <Text>Break</Text>
                    <View style={styles.flex}>
                        <Button title="+" onPress={()=>this.props.incRest()}/>
                        <Text>{this.props.restTimer}</Text>
                        <Button title="-" onPress={()=>this.props.decRest()}/>
                    </View>
                </View>
            </View>
        );
    }
}

export default TimerController;