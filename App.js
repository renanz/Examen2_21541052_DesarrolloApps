import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from "react-native";
import axios from "axios";
import { createStackNavigator, createAppContainer } from "react-navigation";
import HTML from "react-native-render-html";

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { label: "" };
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Job Search</Text>
        <TextInput
          style={styles.textInput}
          editable={true}
          onChangeText={text =>
            this.setState({
              label: text
            })
          }
          placeholder="Search"
        />
        <Button
          title="Button"
          onPress={() =>
            this.props.navigation.navigate("ListOfJobs", {
              search: this.state.label
            })
          }
        />
      </View>
    );
  }
}

class ListOfJobs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: [],
      search: this.props.navigation.state.params.search
    };
  }

  componentDidMount() {
    axios
      .get(`https://jobs.github.com/positions.json`)
      .then(res => {
        let info = [];
        const arr = res.data;
        for (let index = 0; index < arr.length; index += 1) {
          if (arr[index].type == this.state.search) info.push(arr[index]);
        }

        this.setState(() => ({
          jobs: info
        }));
      })
      .catch(err => console.log(err.message)); //eslint-disable-line
  }

  render() {
    return (
      <ScrollView style={{ flex: 1 }}>
        {this.state.jobs.map((data, index) => (
          <TouchableOpacity
            key={index}
            style={{
              borderColor: "gray",
              borderWidth: 2,
              alignItems: "center"
            }}
            onPress={() => this.props.navigation.navigate("JobDetail", {data: data})}
          >
            <Text style={styles.type}>{data.type}</Text>
            <Text style={styles.title}>{data.title}</Text>
            <Text style={styles.description} numberOfLines={2}>{data.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }
}

class JobDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.navigation.state.params.data
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text style={{fontWeight: "bold", fontSize: 16}}>{this.state.data.type}</Text>
          <Text style={{fontSize: 16}}>{this.state.data.title}</Text>
          <HTML html={this.state.data.description} imagesMaxWidth={Dimensions.get("window").width} />
        </ScrollView>
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
    borderColor: "gray",
    borderWidth: 2
  },
  type: {
    fontWeight: "bold",
    fontSize: 16
  },
  title: {
    fontSize: 16
  },
  description: {
    color: "gray",
    fontSize: 14
  }
});

export default createAppContainer(AppNavigator);
