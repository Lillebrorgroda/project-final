import styled from "styled-components"

export const BaseWrapper = styled.div`
width: 100%;
`

export const FullscreenWrapper = styled(BaseWrapper)`
  min-height: 90vh;
  background-color: ${({ theme }) => theme.colors.background};
  display: grid;
  place-items: center;
  perspective: 100rem;
`
export const PageWrapper = styled(BaseWrapper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: ${({ maxWidth }) => maxWidth || "1200px"};
  margin: ${({ centered }) => centered ? "auto" : "0"};
`

export const ScrollableWrapper = styled(BaseWrapper)`
  padding: ${({ theme }) => theme.spacing(2.5)};
  max-width: 1200px;
  margin: 0 auto;
  min-height: 60vh; 
  max-height: none;
  overflow-y: visible;
  
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.backgroundAlt};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 4px;
  }
`

// Grid komponenter
export const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing(2)};
  align-items: center;
  justify-items: center;
  align-content: center;
  justify-content: center;
  place-items: center;
  padding: ${({ theme }) => theme.spacing(2)};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(4, 1fr);
  }
`