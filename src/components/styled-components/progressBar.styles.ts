import styled from 'styled-components';

export const ProgressBarContainerStyled = styled.div`
  margin-left: 0;
  width: 100vw;
  min-width: 450px;
  height: 6px;
  background-color: #cacaca;
  border-radius: 3px;
  position: relative;
  overflow: hidden;
  z-index: 0;
  margin-top: 24px;
  margin-bottom: 24px;

  @media (min-width: 1024px) {
    margin-left: 24px;
    margin-top: 0px;
    margin-bottom: 0px;
    width: 6px;
    min-width: 6px;
    height: 100%;
  }
`;

export const ProgressFillStyled = styled.div<{ percentage: number }>`
  position: absolute;
  background-color: #4caf50;
  transition: all 0.6s ease-in-out;
  z-index: 1;

  top: unset;
  left: 0;
  height: 100%;
  width: ${({ percentage }) => percentage}%;

  @media (min-width: 1024px) {
    top: 0;
    width: 100%;
    height: ${({ percentage }) => percentage}%;
  }
`;
