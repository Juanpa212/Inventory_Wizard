import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/loginScreen";
import InventoryEditor from "./src/screens/InventoryEditor";
import generalStart from "./src/screens/generalStartScreen";
import AddItemScreen from "./src/screens/addItemsScreen";
import forgottenPasswordScreen from "./src/screens/forgottenPasswordScreen";
import createAccountScreen from "./src/screens/createAccountScreen";
import InvoiceManager from "./src/screens/invoiceManager";
import { SQLiteProvider } from "expo-sqlite";

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

const navigator = createStackNavigator(
  {
    home: HomeScreen,
    login: LoginScreen,
    editor: InventoryEditor,
    start_1: generalStart,
    add: AddItemScreen,
    create: createAccountScreen,
    pass: forgottenPasswordScreen,
    invManager: InvoiceManager,
  },
  {
    initialRouteName: "home",
    defaultNavigationOptions: {
      title: "App",
    },
  }
);

const AppContainer = createAppContainer(navigator);

export default function App() {
  return (
    <SQLiteProvider databaseName="MainDB.db" onInit={migrateDbIfNeeded}>
      <AppContainer />
    </SQLiteProvider>
  );
}
