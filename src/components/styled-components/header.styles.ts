import styled from "styled-components";

export const HeaderStyled = styled.header`
  width: 100%;
  height: 58px;
  background-color: #2d2d2d;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  box-sizing: border-box;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);

  @media (min-width: 640px) {
    padding-left: 1.5rem; /* sm:px-6 */
    padding-right: 1.5rem;
    overflow: hidden;
  }

  @media (min-width: 768px) {
    padding-left: 2rem; /* md:px-8 */
    padding-right: 2rem;
  }
`;

export const RightContainerStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (min-width: 640px) {
    gap: 1.25rem; /* sm:gap-5 */
  }

  @media (min-width: 768px) {
    gap: 1.5rem; /* md:gap-6 */
  }
`;

export const UserInfoContainerStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;

  @media (min-width: 640px) {
    gap: 0.75rem;
    padding: 0.25rem 0.75rem;
  }

  @media (min-width: 768px) {
    gap: 1rem;
    padding: 0.25rem 1rem;
  }
`;

export const RoleBadgeStyled = styled.span`
  background-color: #ff8000;
  color: #222222;
  font-weight: 500;
  font-size: 0.75rem;
  font-family: Roboto, sans-serif;
  padding: 0.375rem 0.5rem;
  border-radius: 9999px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
  white-space: nowrap;
  align-content: center;

  @media (min-width: 640px) {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
`;

export const FloatingBoxStyled = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  gap: 16px;
  top: 99%;
  right: 0;
  background-color: #2d2d2d;
  border-bottom-left-radius: 16px;
  padding: 12px;
  z-index: 999;
  width: auto;
  height: auto;

  @media (min-width: 640px) {
    position: relative;
    top: 0;
  }
`;