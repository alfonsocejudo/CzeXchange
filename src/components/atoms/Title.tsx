import styled from 'styled-components/native';

const Title = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.lg};
  font-weight: bold;
  color: ${({theme}) => theme.colors.text};
  margin-bottom: ${({theme}) => theme.spacing.sm};
`;

export default Title;
