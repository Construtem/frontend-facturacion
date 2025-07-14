import styled from 'styled-components';

export const FormInputStyled = styled.div`
    position: relative;
    width: 100%;
    margin-bottom: 32px;
    padding: 4px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background-color: #f9fafb;
    box-sizing: border-box;

    @media (min-width: 511px) {
        width: 70%;
        padding: 16px;
    }
`;

export const LogoContainerStyled = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    overflow: hidden;

    @media (min-width: 511px) {
        width: 30%;
    }
`;