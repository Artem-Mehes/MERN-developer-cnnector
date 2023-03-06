import styled from 'styled-components';

import showcase from 'assets/images/showcase.jpg';

export const Container = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url(${showcase});
`;
