import React, {useState} from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import user icon
import SQlite from "react-native-sqlite-storage";


const db = SQLite.openDatabase(
  {
      name: 'MainDB',
      location: 'default',
  },
  () => { },
  error => { console.log(error) }
);


const createAccountScreen = ({ navigation }) => {

  // variables that change on each run 
  const [userName, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    createTable();
    getData();
  },[]); //RUNS ONLY ONCE ON MOUNT


  // creating a table 
  const createTable = () =>{
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS" + 
        + "Users" 
        + "(id INTEGER PRIMARY KEY AUTOINCREMENT, Username TEXT NOT NULL, Password TEXT NOT NULL, Email TEXT UNIQUE NOT NULL );"
      )
    })
  }

  // getting the data 
  const getData = () => {
      try {
          db.transaction((tx) => {
            tx.executeSql(
                "SELECT userName, email, password FROM Users",
                [],
                (tx, results) => {
                     var len = results.rows.length;
                     if (len > 0) {
                      navigation.navigate("#");
                }
              }
            )
        })
    } catch (error) {
        console.log(error);
    }
  }


// sets the data into the into the table 
  const setData =  async() =>{
    if(userName.length == 0 || password.length == 0 || email.length == 0){
      Alert.alert("Warning!","Please write your data.")
    }
    else{
      try{
        await db.transaction(async (tx) => {
          await tx.executeSql(
            "INSERT INTO Users (userName, password, email) VALUES (?,?,?)",
            [userName,password,email]
          );
        })
        navigation.navigate("#");
      }catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Create your account</Text>

      {/* User Icon */}
      <View style={styles.iconContainer}>
        <FontAwesome name="user-circle" size={80} color="#0000" />
      </View>

      {/* Username Input */}
      <Text style={styles.label}>Username</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter username" 
        onChangeText={(value) => setUser(value)}
      />

    <Text style={styles.label}>Email </Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter Email / Phone Number"
        onChangeText={(value) => setEmail(value)} 
      />
      {/* Password Input */}
      <Text style={styles.label}>Password</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter password" 
        secureTextEntry 
        onChangeText={(value) => setPassword(value)}
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={setData}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* Forgot Password */}
      <TouchableOpacity onPress={() => {navigation.navigate("forgor")}}>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>

      {/* Create Account */}
      <TouchableOpacity onPress={() => {navigation.navigate("create")}}>
        <Text style={styles.createAccount}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    color: '#000',
  },
  input: {
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginVertical: 10,
  },
  loginButton: {
    backgroundColor: '#6C48C5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    color: '#6C48C5',
    textAlign: 'center',
    marginTop: 15,
  },
  createAccount: {
    color: '#6C48C5',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default createAccountScreen;
