import styled from "styled-components"

// Button komponenter
export const PrimaryButton = styled.button`
  padding: ${({ theme }) => theme.components.button.padding};
  border: ${({ theme }) => theme.components.button.border};
  border-radius: ${({ theme }) => theme.components.button.borderRadius};
  background-color: ${({ theme }) => theme.colors.primary};
  color:${({ theme }) => theme.colors.text} ;
  cursor: pointer;
  transition: ${({ theme }) => theme.components.button.transition};
  font-family: ${({ theme }) => theme.fonts.body};
  margin: ${({ theme }) => theme.components.button.margin};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  min-height: 40px;

  &:hover {
    background-color: #f8d7da;
    color: #721c24;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      background-color: transparent;
      transform: none;
    }
  }

  &:focus {
    outline: 2px solid #dc3545;
    outline-offset: 2px;
  }

  /* Alternativ med text */
  &.with-text {
    flex-direction: row;
    gap: 8px;
    padding: 10px 16px;
    font-size: 0.9rem;
    
    &::after {
      content: "Ta bort";
    }
  }

  /* Varning-stil för viktigare borttagningar */
  &.warning {
    color: #856404;
    
    &:hover {
      background-color: #fff3cd;
      color: #533f03;
    }
  }

  /* Minimal stil */
  &.minimal {
    padding: 4px;
    font-size: 1rem;
    min-width: 30px;
    min-height: 30px;
    
    &:hover {
      background-color: rgba(220, 53, 69, 0.1);
    }
  }
`


export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 20px;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
    justify-content: center;
  }
`