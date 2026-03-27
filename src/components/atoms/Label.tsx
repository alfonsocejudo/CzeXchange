import styled from 'styled-components/native';

const Label = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
  text-transform: uppercase;
  letter-spacing: 2px;
`;

export default Label;
