import styled from 'styled-components/native';

const Subtitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.md};
  color: ${({theme}) => theme.colors.textSecondary};
`;

export default Subtitle;
