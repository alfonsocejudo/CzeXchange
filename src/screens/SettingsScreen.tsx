import React from 'react';
import {Pressable} from 'react-native';
import styled from 'styled-components/native';
import AppScreen from '../components/templates/AppScreen';
import Title from '../components/atoms/Title';
import {useSource} from '../context/SourceContext';
import {Source} from '../types/exchangeRate';

const Label = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.md};
  color: ${({theme}) => theme.colors.textSecondary};
  margin-bottom: ${({theme}) => theme.spacing.md};
`;

const Option = styled.View<{selected: boolean}>`
  flex-direction: row;
  align-items: center;
  padding: ${({theme}) => theme.spacing.md};
  margin-bottom: ${({theme}) => theme.spacing.sm};
  background-color: ${({selected, theme}) =>
    selected ? theme.colors.primary + '15' : theme.colors.background};
  border-radius: 8px;
  border-width: 1px;
  border-color: ${({selected, theme}) =>
    selected ? theme.colors.primary : '#E0E0E0'};
`;

const OptionText = styled.Text<{selected: boolean}>`
  font-size: ${({theme}) => theme.fontSizes.md};
  color: ${({selected, theme}) =>
    selected ? theme.colors.primary : theme.colors.text};
  font-weight: ${({selected}) => (selected ? 'bold' : 'normal')};
`;

const sources: {key: Source; label: string}[] = [
  {key: 'cnb', label: 'Czech National Bank'},
  {key: 'floatrates', label: 'FloatRates'},
  {key: 'exchangerate-api', label: 'ExchangeRate-API'},
];

export default function SettingsScreen() {
  const {source, setSource} = useSource();

  return (
    <AppScreen>
      <Title>Settings</Title>
      <Label>Exchange rate source</Label>
      {sources.map(({key, label}) => (
        <Pressable key={key} onPress={() => setSource(key)}>
          <Option selected={source === key}>
            <OptionText selected={source === key}>{label}</OptionText>
          </Option>
        </Pressable>
      ))}
    </AppScreen>
  );
}
