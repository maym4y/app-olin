import { StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.gainsboro
  },
  body: {
    backgroundColor: colors.background,
    padding: 5
  },
  iconView: {
    alignItems: 'center'
  },
  icon: {
    height: 100,
    width: 200,
    margin: 50
  },
  loginView: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '30%'
  },
  input: {
    height: 50,
    width: '90%',
    margin: 12,
    borderWidth: 1,
    borderRadius: 30,
    padding: 10
  },
  loginButton: {
    height: 50,
    width: '40%',
    fontSize: 30,
    margin: 15,
    padding: 12,
    borderRadius: 5,
    backgroundColor: colors.midnightNavy,
    alignItems: 'center'
  },
  buttonText: {
    color: colors.gainsboro
  },
  searchBar: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.gainsboro,
    borderRadius: 30,
    paddingHorizontal: 15,
    marginBottom: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.lightSlateGray
  },
  searchIcon: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  searchInput: {
    flex: 1,
    maxWidth: '80%'
  },
  caseCard: {
    backgroundColor: colors.midnightNavy,
    borderRadius: 15,
    margin: 10,
    padding: 15
  },
  cardBottom: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  lightText: {
    color: colors.gainsboro
  },
  listDisplay: {
    marginBottom: 150
  }
});
