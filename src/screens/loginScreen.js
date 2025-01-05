import React, {useState,useEffect} from 'react';
import { FontAwesome } from '@expo/vector-icons'; // Import user icon
import SQlite from "react-native-sqlite-storage";
import {AsyncStorage} from 'react-native';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';


const db = SQlite.openDatabase(
  {
    name:"MainDB",
    location:"default",
  },
  () => { },
  error => {console.log(error)}
);


const LoginScreen = ({ navigation }) => {

  // const [name, setName] = useState("");
  // const [id, setID] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const getData = () => {
      try {
          db.transaction((tx) => {
            tx.executeSql(
                "SELECT email, password FROM Users",
                [],
                (tx, results) => {
                     var len = results.rows.length;
                     if (len > 0) {
                        //  var iden = results.rows.item(0).id;
                        //  var userName = results.rows.item(0).name;
                         var eM = results.rows.item(0).email;
                         var pass = results.rows.item(0).password;
                        //  setID(iden);
                        //  setName(userName);
                         setEmail(eM);
                         setPassword(pass);
                    }
                }
            )
        })
    } catch (error) {
        console.log(error);
    }
    }
  useEffect(() => {
    getData()
  },[]); //RUNS ONLY ONCE ON MOUNT



  const validateLogin = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM Users WHERE email = ? AND password = ?;`,
        [email, password],
        (tx, results) => {
          if (results.rows.length > 0) {
            const user = results.rows.item(0);
            console.log("Login successful for user:", user.username);
            navigation.navigate("editor"); // Navigate to dashboard or home
          } else {
            alert("Invalid email or password.");
          }
        },
        (txObj, error) => {
          console.log("Error during login:", error);
        }
      );
    });
  };
  

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Login</Text>

      {/* User Icon */}
      <View style={styles.iconContainer}>
        <FontAwesome name="user-circle" size={80} color="#0000" />
      </View>

      {/* Username Input */}
      <Text style={styles.label}>Username</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter username" 
      />

      {/* Password Input */}
      <Text style={styles.label}>Password</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter password" 
        secureTextEntry 
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={validateLogin}>
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

export default LoginScreen;
