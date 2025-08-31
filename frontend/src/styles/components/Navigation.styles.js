import styled from "styled-components"

export const Header = styled.div`
display: flex;
justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  top: 0;
`


export const FooterIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  margin: 0 10px;
  transition: color 0.3s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Tvinga React Icons storlek */
  svg {
    width: 24px !important;
    height: 24px !important;
  }
`

// Footer komponenter
export const FooterStyled = styled.footer`
position: fixed;
  bottom: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  text-align: center;
  padding: 10px;
  box-shadow: 0 -2px 5px ${({ theme }) => theme.colors.shadow};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`
