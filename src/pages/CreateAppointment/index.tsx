/* eslint-disable prettier/prettier */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { Alert, Platform } from 'react-native';
import DateTImePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

import { useAuth } from '../../hooks/Auth';
import api from '../../services/api';

import {
  Container,
  Header,
  BackButton,
  UserAvatar,
  Content,
  HeaderTitle,
  ProvidersListContainer,
  ProviderList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from './styles';

interface RouteParams {
  providerId: string;
}

interface Provider {
  id: string;
  name: string;
  getAvatarUrl: string;
}

interface AvailabilityItem {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const { user } = useAuth();
  const route = useRoute();
  const { goBack, navigate } = useNavigation();

  const routeParams = route.params as RouteParams;

  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(0);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId,
  );

  useEffect(() => {
    // eslint-disable-next-line prettier/prettier
    api.get('providers').then((response) => {
      setProviders(response.data);
    });
  }, []);

  useEffect(() => {
    api.get(`providers/${selectedProvider}/day-availability`, {
      params: {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate(),
      },
    })
      .then((response) => {
        setAvailability(response.data);
      });
  }, [selectedDate, selectedProvider]);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);

  const handleToogleDatePicker = useCallback(() => {
    // eslint-disable-next-line prettier/prettier
    setShowDatePicker((state) => !state);
  }, []);

  const handleDateChanged = useCallback(
    (event: any, date: Date | undefined) => {
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
      }

      if (date) {
        setSelectedDate(date);
      }
    },
    [],
  );

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);

      date.setHours(selectedHour + 3);
      date.setMinutes(0);

      await api.post('appointments', {
        provider_id: selectedProvider,
        date,
      });

      navigate('AppointmentCreated', { date: date.getTime() });
    } catch (error) {
      Alert.alert(
        'Erro ao criar agendamento',
        'Ocorreu um erro ao criar o agendamento. Tente novamente!',
      );
    }
  }, [selectedProvider, navigate, selectedDate, selectedHour]);

  const morningAvailability = useMemo(() => availability.filter(({ hour }) => hour < 12)
    .map(({ hour, available }) => ({
      hour,
      available,
      formatedHour: format(new Date().setHours(hour), 'HH:00'),
    })), [availability]);

  const afternoonAvailability = useMemo(() => availability.filter(({ hour }) => hour >= 12)
    .map(({ hour, available }) => ({
      hour,
      available,
      formatedHour: format(new Date().setHours(hour), 'HH:00'),
    })), [availability]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleleiros</HeaderTitle>

        <UserAvatar source={{ uri: user.getAvatarUrl }} />
      </Header>

      <Content>
        <ProvidersListContainer>
          <ProviderList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={(provider: any) => provider.id}
            renderItem={({ item: provider }: any) => (
              <ProviderContainer
                onPress={() => handleSelectProvider(provider.id)}
                selected={provider.id === selectedProvider}
              >
                <ProviderAvatar source={{ uri: provider.getAvatarUrl }} />
                <ProviderName selected={provider.id === selectedProvider}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>

        <Calendar>
          <Title>Escolha a data</Title>

          <OpenDatePickerButton onPress={handleToogleDatePicker}>
            <OpenDatePickerButtonText>
              Selecionar outra Data
            </OpenDatePickerButtonText>
          </OpenDatePickerButton>

          {showDatePicker && (
          <DateTImePicker
            mode="date"
            display="calendar"
            // textColor="#f4ede8"
            onChange={handleDateChanged}
            value={selectedDate}
          />
          )}
        </Calendar>

        <Schedule>
          <Title>Escolha o horario</Title>

          <Section>

            <SectionTitle>Manhã</SectionTitle>

            <SectionContent>
              {morningAvailability.map(({ formatedHour, hour, available }) => (
                <Hour
                  enabled={available}
                  selected={selectedHour === hour}
                  available={available}
                  key={formatedHour}
                  onPress={() => handleSelectHour(hour)}
                >
                  <HourText selected={selectedHour === hour}>{formatedHour}</HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>

          <Section>

            <SectionTitle>Tarde</SectionTitle>

            <SectionContent>
              {afternoonAvailability.map(({ formatedHour, hour, available }) => (
                <Hour
                  enabled={available}
                  selected={selectedHour === hour}
                  available={available}
                  key={formatedHour}
                  onPress={() => handleSelectHour(hour)}
                >
                  <HourText selected={selectedHour === hour}>{formatedHour}</HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>
        </Schedule>

        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>

    </Container>
  );
};

export default CreateAppointment;
