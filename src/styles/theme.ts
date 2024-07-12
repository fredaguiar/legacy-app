import { createTheme } from '@rneui/themed';

export const FORM_COMPONENT_WIDTH = 'auto';

const LightColors = {
  primary: '#E1AB55',
  secondary: '#F3CF94',
  text1: 'black',
  text2: '#8EA18D',
  important: '#f77272',
  disabled: '#b1b1b1',
  success: '#2CA62E',
  highlight: '#00ff00',
  danger: '#f77272',
  warning: '#ffc107',
  error: '#dc3545',
  divider1: '#8EA18D',
  divider2: '#4E584D',
  row1: '#f6f1f1',
  row2: '#f6f1f1',
  info: '#17a2b8',
  background: 'white',
  background1: '#FEF5D4',
  background2: '#fdeca6',
  background3: '#E1AB55',
  input1: 'white',
  input2: '#C2BB8D',
};

export const theme = createTheme({
  lightColors: LightColors,
  mode: 'light',
  components: {
    Button: {
      radius: 20,
      color: 'primary',
      titleStyle: { fontWeight: 'bold', fontSize: 20 },
    },
    Text: {
      style: {
        fontSize: 20,
      },
    },
    Input: {
      inputContainerStyle: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 2,
        borderWidth: 1,
      },
    },
  },
});
