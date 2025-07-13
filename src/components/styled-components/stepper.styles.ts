import styled from 'styled-components';

export const StepperContainerStyled = styled.div`
  position: absolute;
  width: calc(100% + 100px);
  padding-right: 48px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  z-index: 2;

  @media (min-width: 768px) and (max-width: 1023px) {
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    height: 60px;
  }

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
  align-items: center;
  color: ${({ $iscurrent }) => ($iscurrent ? '#222222' : '#cacaca')};

  @media (min-width: 768px) and (max-width: 1023px) {
    align-items: flex-start;
  }
`;