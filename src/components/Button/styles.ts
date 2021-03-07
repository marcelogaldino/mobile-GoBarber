import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled(RectButton)`
  width: 106%;
  height: 60px;
  padding: 0 148px;
  border-radius: 10px;
  background-color: #ff9000;

  justify-content: center;
  align-items: center;

  margin-top: 8px;

  flex-direction: row;
`;

export const ButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 18px;
  color: #312e38;
`;
