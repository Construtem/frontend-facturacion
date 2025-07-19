import styled from 'styled-components';

export const OrangeBoxStyled = styled.div`
    background-color: #FF7300;
    margin: 0 auto 30px auto;
    display: flex;
    flex-wrap: wrap;
    color: white;
    border-radius: 8px;
    box-sizing: border-box;
    padding: 10px;
    justify-content: left;
    flex-direction: column;
    gap: 8px;

    @media (min-width: 511px) {
        justify-content: space-between;
        flex-direction: row;
        gap: 0px;
    }
`;

export const OrangeBoxItemStyled = styled.div`
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    box-sizing: border-box;
    height: 60px;
    width: 100%;

    @media (min-width: 511px) {
        width: 45%;
    }
`;

export const FooterBoxStyled = styled.div`
    background-color: #FF7300;
    display: flex;
    color: white;
    border-radius: 8px;
    box-sizing: border-box;
    padding: 10px;
    justify-content: left;
    flex-direction: column;
    gap: 8px;

    @media (min-width: 511px) {
        justify-content: space-between;
        flex-direction: row;
        gap: 0px;
    }
`;
export const ButtonContainerStyled = styled.div`
    bottom: 0px;
    left: 0px;
    right: 0px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 16px;
    margin-top: 16px;
    overflow: hidden;

    @media (min-width: 511px) {
        justify-content: flex-end;
        flex-direction: row;
    }
`;