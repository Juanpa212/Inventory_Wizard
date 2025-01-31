// import { createAppContainer } from "react-navigation";
// import { createStackNavigator } from "react-navigation-stack";
// import HomeScreen from "./src/screens/HomeScreen";
// import LoginScreen from "./src/screens/loginScreen";
// import InventoryEditor from "./src/screens/InventoryEditor";
// import generalStart from "./src/screens/generalStartScreen";
// import AddItemScreen from "./src/screens/addItemsScreen";
// import forgottenPasswordScreen from "./src/screens/forgottenPasswordScreen";
// import createAccountScreen from "./src/screens/createAccountScreen";
// import InvoiceManager from "./src/screens/invoiceManager";
// import { SQLiteProvider } from "expo-sqlite";
// import HelpCenter from "./src/screens/HelpCenter";
// import CreateInventoryScreen from "./src/screens/inventoryScreen";

// async function migrateDbIfNeeded(db) {
//   const DATABASE_VERSION = 1;
//   const result = await db.getFirstAsync("PRAGMA user_version");
//   let currentDbVersion = result.user_version;

//   if (currentDbVersion >= DATABASE_VERSION) {
//     return;
//   }

//   if (currentDbVersion === 0) {
//     await db.execAsync(`
//       PRAGMA journal_mode = 'wal';
//       CREATE TABLE IF NOT EXISTS Users (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         Username TEXT NOT NULL,
//         Email TEXT UNIQUE NOT NULL,
//         Password TEXT NOT NULL
//       );
//     `);
//     currentDbVersion = 1;
//   }

//   await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
// }

// const navigator = createStackNavigator(
//   {
//     home: HomeScreen,
//     login: LoginScreen,
//     editor: InventoryEditor,
//     start_1: generalStart,
//     add: AddItemScreen,
//     create: createAccountScreen,
//     pass: forgottenPasswordScreen,
//     invManager: InvoiceManager,
//     help : HelpCenter,
//     inventory : CreateInventoryScreen,
//   },
//   {
//     initialRouteName: "home",
//     defaultNavigationOptions: {
//       title: "App",
//     },
//   }
// );

// const AppContainer = createAppContainer(navigator);

// export default function App() {
//   return (
//     <SQLiteProvider databaseName="MainDB.db" onInit={migrateDbIfNeeded}>
//       <AppContainer />
//     </SQLiteProvider>
//   );
// }

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/loginScreen";
import InventoryEditor from "./src/screens/InventoryEditor";
import GeneralStart from "./src/screens/generalStartScreen";
import AddItemScreen from "./src/screens/addItemsScreen";
import ForgottenPasswordScreen from "./src/screens/forgottenPasswordScreen";
import CreateAccountScreen from "./src/screens/createAccountScreen";
import InvoiceManager from "./src/screens/invoiceManager";
import { SQLiteProvider } from "expo-sqlite";
import HelpCenter from "./src/screens/HelpCenter";
import CreateInventoryScreen from "./src/screens/inventoryScreen";
import stockLevels from "./src/screens/stockLevels";

const Stack = createStackNavigator();

async function migrateDbIfNeeded(db) {
  const DATABASE_VERSION = 1;
  const result = await db.getFirstAsync("PRAGMA user_version");
  let currentDbVersion = result.user_version;
  
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  
  if (currentDbVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Username TEXT NOT NULL,
        Email TEXT UNIQUE NOT NULL,
        Password TEXT NOT NULL
      );
    `);
    currentDbVersion = 1;
  }
  
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

function App() {
  return (
    <SQLiteProvider databaseName="MainDB.db" onInit={migrateDbIfNeeded}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="home"
          screenOptions={{
            headerShown: true,
            headerTitle: "App"
          }}
        >
          <Stack.Screen name="home" component={HomeScreen} />
          <Stack.Screen name="login" component={LoginScreen} />
          <Stack.Screen name="editor" component={InventoryEditor} />
          <Stack.Screen name="start_1" component={GeneralStart} />
          <Stack.Screen name="add" component={AddItemScreen} />
          <Stack.Screen name="create" component={CreateAccountScreen} />
          <Stack.Screen name="forgotPassword" component={ForgottenPasswordScreen} />
          <Stack.Screen name="invManager" component={InvoiceManager} />
          <Stack.Screen name="help" component={HelpCenter} />
          <Stack.Screen name="inventory" component={CreateInventoryScreen} />
          <Stack.Screen name="stock" component={stockLevels} />
        </Stack.Navigator>
      </NavigationContainer>
    </SQLiteProvider>
  );
}

export default App;
