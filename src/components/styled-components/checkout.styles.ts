import styled from 'styled-components';

export const PageContainerStyled = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px;

  @media (min-width: 1024px) {
    padding: 48px;
  }
`;

export const ContainerWrapperStyled = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  padding: 32px;
  gap: 16px;
  box-sizing: border-box;

  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

export const WizardContainerStyled = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  background-color: #f0f0f0;
  padding: 32px;
  border-radius: 16px;
  box-sizing: border-box;
  gap: 32px;
  overflow-x: auto;

  @media (min-width: 1024px) {
    width: 30%;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
  }
`;

export const TabContainerStyled = styled.div`
  position: relative;
  width: 100%;
  padding: 16px 0px;
  min-height: 500px;
  box-sizing: border-box;

  @media (min-width: 768px) and (max-width: 1023px) {
    padding: 24px;
  }

  @media (min-width: 1024px) {
    width: 70%;
    padding: 32px;
  }
`;
