import styled from 'styled-components';

export const StepperContainerStyled = styled.div`
  position: absolute;
  width: 100%;
  padding-right: 48px;
  height: 60px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  z-index: 2;
  overflow: hidden;

  @media (min-width: 1024px) {
    flex-direction: column;
    overflow: visible;
    height: 100%;
  }
`;

export const StepLabelStyled = styled.span<{ $iscurrent: boolean }>`
  font-size: 16px;
  font-weight: bold;
  transition: color 0.6s ease-in-out;
  display: flex;
  align-items: flex-start;
  color: ${({ $iscurrent }) => ($iscurrent ? '#222222' : '#cacaca')};

  @media (min-width: 1024px) {
    align-items: center;
  }
`;