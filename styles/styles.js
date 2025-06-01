import { StyleSheet } from "react-native";
import { colors } from "../constants/colors";

export const styles = StyleSheet.create({
  body: {
    backgroundColor: colors.gainsboro,
  },
  iconView: {
    alignItems: 'center',
  },
  icon: {
    height: 100,
    width: 200,
    margin: 50
  },
  loginView: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '30%',
  },
  input: {
    height: 50,
    width: '90%',
    margin: 12,
    borderWidth: 1,
    borderRadius: 30,
    padding: 10,
  },
  loginButton: {
    height: 50,
    width: '40%',
    fontSize: 30,
    margin: 15,
    padding: 12,
    borderRadius: 5,
    backgroundColor: colors.navy,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.gainsboro,
  },
  searchBar: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.gainsboro,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.gray
  },
  searchIcon: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    width: 150,
  },
  notification: {
    paddingRight: '25'
  },
  caseChart: {
    width: '100%'
  }
});