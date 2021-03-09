import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';

import { useAuth } from '../../hooks/Auth';
import api from '../../services/api';

import {
  Container,
  Header,
  HeaderTitle,
  UserName,
  ProfileButton,
  UserAvatar,
  ProvidersList,
  ProviderInfo,
  ProviderMetaText,
  ProviderMeta,
  ProviderContainer,
  ProviderName,
  ProviderAvatar,
  ProvidersListTitle,
} from './styles';

interface Provider {
  id: string;
  name: string;
  getAvatarUrl: string;
}

const Dashboard: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const { user, signOut } = useAuth();
  const { navigate } = useNavigation();

  useEffect(() => {
    // eslint-disable-next-line prettier/prettier
    api.get('providers').then((response) => {
      setProviders(response.data);
    });
  }, []);

  const navigateToProfile = useCallback(() => {
    // signOut();
    navigate('Profile');
  }, [navigate]);

  const navigateToCreateAppointment = useCallback(
    (providerId: string) => {
      navigate('CreateAppointment', { providerId });
    },
    [navigate],
  );

  return (
    <Container>
      <Header>
        <HeaderTitle>
          Bem vindo,
          {'\n'}
          <UserName>{user.name}</UserName>
        </HeaderTitle>

        <ProfileButton onPress={navigateToProfile}>
          <UserAvatar source={{ uri: user.getAvatarUrl }} />
        </ProfileButton>
      </Header>

      <ProvidersList
        data={providers}
        // eslint-disable-next-line prettier/prettier
        keyExtractor={(provider: any) => provider.id}
        ListHeaderComponent={
          <ProvidersListTitle>Cabeleleiros</ProvidersListTitle>
        }
        renderItem={({ item: provider }: any) => (
          <ProviderContainer
            onPress={() => navigateToCreateAppointment(provider.id)}
          >
            <ProviderAvatar source={{ uri: provider.getAvatarUrl }} />

            <ProviderInfo>
              <ProviderName>{provider.name}</ProviderName>

              <ProviderMeta>
                <Icon name="calendar" size={14} color="#ff9000" />
                <ProviderMetaText>Segunda à sexta</ProviderMetaText>
              </ProviderMeta>

              <ProviderMeta>
                <Icon name="clock" size={14} color="#ff9000" />
                <ProviderMetaText>8h às 18h</ProviderMetaText>
              </ProviderMeta>
            </ProviderInfo>
          </ProviderContainer>
        )}
      />
    </Container>
  );
};

export default Dashboard;
