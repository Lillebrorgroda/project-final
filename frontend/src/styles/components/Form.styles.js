import styled from "styled-components"

// Input komponenter
export const StyledInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.components.input.padding};
  margin: ${({ theme }) => theme.components.input.margin};
  border: ${({ theme }) => theme.components.input.border};
  border-radius: ${({ theme }) => theme.components.input.borderRadius};
  font-family: ${({ theme }) => theme.fonts.body};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

// Search komponenter
export const SearchBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
  width: 100%;
  max-width: 600px;
`