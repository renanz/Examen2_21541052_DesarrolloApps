import React from "react";
import { View, Text, StyleSheet, Button, TextInput, ScrollView } from "react-native";
import axios from "axios";
import { createStackNavigator, createAppContainer } from "react-navigation";

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {label: '' };
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Job Search</Text>
        <TextInput
            style={styles.textInput}
            editable = {true}
            onChangeText={(text) => this.setState({
              label: text
            })}
            placeholder='Search'
          />
        <Button
          title="Button"
          onPress={() => this.props.navigation.navigate("ListOfJobs", {search: this.state.label})}
        />
      </View>
    );
  }
}

class ListOfJobs extends React.Component {
  constructor(props) {
    super(props);
    this.state = { jobs: [], search: this.props.navigation.state.params.search};
  }

  componentDidMount() {
    axios
      .get(`https://jobs.github.com/positions.json`)
      .then(res => {
        let info: [];
        const arr = res.data;
        for (let index = 0; index < arr.length; index += 1){
            info.push(arr[index]);
        } 

        this.setState(() => ({
          jobs: info
        }));
      })
      .catch(err => console.log(err.message)); //eslint-disable-line
  }

  render() {
    return (
      <ScrollView style={{flex:1}}>
        <Text>{this.state.search}</Text>
        {this.state.jobs.map((data, index) => (
          <Text key={index}>{data.title}</Text>
        ))}
        <Button
          title="Go to Job Detail... again"
          onPress={() => this.props.navigation.navigate("JobDetail")}
        />
      </ScrollView>
    );
  }
}

class JobDetail extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Details Screen</Text>
      </View>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    ListOfJobs: ListOfJobs,
    JobDetail: JobDetail
  },
  {
    initialRouteName: "Home"
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  textInput: {
    borderColor: 'blue',
    borderWidth: 2
  },
});

export default createAppContainer(AppNavigator);
