import React from 'react';
import { render } from 'react-native-testing-library';

import SignIn from '../../pages/SignIn';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

describe('SignIn page', () => {
  it('Should be able to sign in', () => {
    const { getByPlaceholder } = render(<SignIn />);

    expect(getByPlaceholder('E-mail')).toBeTruthy();
    expect(getByPlaceholder('Senha')).toBeTruthy();
  });
});
