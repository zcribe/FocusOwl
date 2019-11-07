import React, {Component} from 'react';
import {Button, StyleSheet, Text, View, TouchableOpacity} from 'react-native';


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
    },
    timerButton: {
    },
    timerButtonText: {
        fontSize: 30,
        fontWeight: '700',
        paddingLeft: 20,
        paddingRight: 20,
        color: '#fff'
    },
    timerButtonTextAdd: {
        fontSize: 30,
        fontWeight: '700',
        paddingLeft: 20,
        paddingRight: 20,
        color: '#34B3FE'
    },
    timerButtonTextAddAlt: {
        fontSize: 30,
        fontWeight: '700',
        paddingLeft: 20,
        paddingRight: 20,
        color: '#C6FF82'
    },
    timerLabel:{
        fontSize: 24,
        fontWeight: '700',
        color: '#E1E4F3'
    },
    timerSubLabel:{
        fontSize: 8,
        fontWeight: 'bold',
        color: '#485683'
    },
    timerSubLabelAlt:{
        fontSize: 8,
        fontWeight: 'bold',
        color: '#378336'
    },
    timerController:{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 30,
        paddingBottom: 30,
        backgroundColor: '#272F50',
        opacity: 0.8,
        borderRadius: 3
    },

    timerControllerAlt:{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 30,
        paddingBottom: 30,
        backgroundColor: '#27401a',
        opacity: 0.8,
        borderRadius: 3
    },
    timerName:{
        color: '#9FA6C9',
        fontWeight: '300'
    },
    timerNameAlt:{
        color: '#91c99a',
        fontWeight: '300'
    }
})

class TimerController extends Component {
    render() {
        let buttonTextAdd, subLabel, name, timerController;

        if (this.props.counterType === 'work'){
            buttonTextAdd = styles.timerButtonTextAdd;
            subLabel = styles.timerSubLabel;
            name = styles.timerName
            timerController = styles.timerController
        } else {
            buttonTextAdd = styles.timerButtonTextAddAlt;
            subLabel = styles.timerSubLabelAlt;
            name = styles.timerNameAlt
            timerController = styles.timerControllerAlt
        }
        return (
            <View style={timerController}>

                <View style={styles.flexColumn}>
                    <Text style={name}>Keskendu</Text>
                    <View style={styles.flex}>
                        <TouchableOpacity title="+" onPress={()=>this.props.incWork()} style={styles.timerButton}>
                            <Text style={buttonTextAdd}>+</Text>
                        </TouchableOpacity>
                        <Text style={styles.timerLabel}>{this.props.workTimer}</Text>
                        <Text style={subLabel}> min</Text>
                        <TouchableOpacity title="-" onPress={()=>this.props.decWork()} style={styles.timerButton}>
                            <Text style={styles.timerButtonText}>-</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.flexColumn}>
                    <Text style={name}>Paus</Text>
                    <View style={styles.flex}>
                        <TouchableOpacity title="+" onPress={()=>this.props.incRest()} style={styles.timerButton}>
                            <Text style={buttonTextAdd}>+</Text>
                        </TouchableOpacity>
                        <Text style={styles.timerLabel}>{this.props.restTimer}</Text>
                        <Text style={subLabel}> min</Text>
                        <TouchableOpacity title="-" onPress={()=>this.props.decRest()} style={styles.timerButton} >
                            <Text style={styles.timerButtonText}>-</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

export default TimerController;