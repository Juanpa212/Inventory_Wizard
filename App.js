import * as Notifications from 'expo-notifications';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/loginScreen";
import GeneralStart from "./src/screens/generalStartScreen";
import AddItemScreen from "./src/screens/addItemsScreen";
import ForgottenPasswordScreen from "./src/screens/forgottenPasswordScreen";
import CreateAccountScreen from "./src/screens/createAccountScreen";
import InvoiceCreator from "./src/screens/invoiceCreator";
import InvoiceManager from './src/screens/invoiceManager';
import { SQLiteProvider } from "expo-sqlite";
import HelpCenter from "./src/screens/HelpCenter";
import CreateInventoryScreen from "./src/screens/inventoryScreen";
import StockAlertsPage from "./src/screens/stockLevels";
import InventoryViewer from './src/screens/InventoryViewer';
import teamViewer from './src/screens/teamViewer';
import InventoryManagerScreen from './src/screens/inventoryManager';
import EditInventoryScreen from './src/screens/EditInventoryScreen';
import EditItemScreen from './src/screens/EditItemScreen';
import ItemManagerScreen from './src/screens/itemManager';
import DeleteItemsScreen from './src/screens/deleteItem';
import AllInventoriesScreen from './src/screens/allInvetoryScreen';
import DeleteInvoiceScreen from './src/screens/deleteInvoice';
import ViewInvoiceDetails from './src/screens/InvoicelistScreen';


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



Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const requestNotificationPermission = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Only ask if permissions have not already been determined
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // Alert the user if permission wasn't granted
    if (finalStatus !== 'granted') {
      alert('You need to enable notifications to receive stock alerts.');
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

function App() {

  useEffect(() => {
    requestNotificationPermission();
  }, []); 
  return (
    <SQLiteProvider databaseName="MainDB.db" onInit={migrateDbIfNeeded}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="login"
          screenOptions={{
            headerShown: true,
            headerTitle: "App"
          }}
        >
          <Stack.Screen name="home" component={HomeScreen} />
          <Stack.Screen name="login" component={LoginScreen} />
          <Stack.Screen name="start_1" component={GeneralStart} />
          <Stack.Screen name="add" component={AddItemScreen} />
          <Stack.Screen name="create" component={CreateAccountScreen} />
          <Stack.Screen name="forgotPassword" component={ForgottenPasswordScreen} />
          <Stack.Screen name="invoiceManager" component={InvoiceManager} />
          <Stack.Screen name="help" component={HelpCenter} />
          <Stack.Screen name="inventory" component={CreateInventoryScreen} />
          <Stack.Screen name="stock" component={StockAlertsPage} />
          <Stack.Screen name="inventoryManager" component={InventoryManagerScreen} />
          <Stack.Screen name="createInvoice" component={InvoiceCreator} />
          <Stack.Screen name="invViewer" component={InventoryViewer} />
          <Stack.Screen name="teamViewer" component={teamViewer} />
          <Stack.Screen name="editItem" component={EditItemScreen} />
          <Stack.Screen name="editInventory" component={EditInventoryScreen} />
          <Stack.Screen name="itemManager" component={ItemManagerScreen} />
          <Stack.Screen name="deleteItem" component={DeleteItemsScreen} />
          <Stack.Screen name="allInv" component={AllInventoriesScreen} />
          <Stack.Screen name="invoiceDetail" component={ViewInvoiceDetails} />
          <Stack.Screen name="deleteInvoice" component={DeleteInvoiceScreen} />
          
        </Stack.Navigator>
      </NavigationContainer>
    </SQLiteProvider>
  );
}

export default App;
