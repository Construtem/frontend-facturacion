import styled from 'styled-components';

export const ProgressBarContainerStyled = styled.div`
  margin-left: 24px;
  width: 6px;
  height: 100%;
  background-color: #cacaca;
  border-radius: 3px;
  position: relative;
  overflow: hidden;
  z-index: 0;

  @media (min-width: 768px) and (max-width: 1023px) {
    margin-left: 0;
    margin-top: 24px;
    width: 800px;
    height: 6px;
  }

  @media (min-width: 1024px) {
    margin-left: 24px;
    width: 6px;
    height: 100%;
  }
`;

export const ProgressFillStyled = styled.div<{ percentage: number }>`
  position: absolute;
  background-color: #4caf50;
  transition: all 0.6s ease-in-out;
  z-index: 1;

  top: 0;
  width: 100%;
  height: ${({ percentage }) => percentage}%;

  @media (min-width: 768px) and (max-width: 1023px) {
    top: unset;
    left: 0;
    height: 100%;
    width: ${({ percentage }) => percentage}%;
  }
`;
