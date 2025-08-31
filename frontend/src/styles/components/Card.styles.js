import styled from "styled-components"

export const BaseCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  box-shadow: 0 2px 8px ${({ theme }) => theme.colors.shadow};
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`

export const PlantSearchCard = styled(BaseCard)`
  position: relative;
  
  &.from-api {
    border-left: 4px solid #3498db;
  }

  &.from-db {
    border-left: 4px solid ${({ theme }) => theme.colors.primary};
  }
`

export const PlantCard = styled(BaseCard)`
  height: 550px;
  width: 300px;
  padding: ${({ theme }) => theme.spacing(2)};
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: 200px;
    height: auto;
    border-radius: 10px;
    margin-bottom: 15px;
  }

  h3 {
    margin-bottom: 10px;
    color: ${({ theme }) => theme.colors.text};
    text-align: center;
  }

  p {
    text-align: center;
    margin-bottom: 15px;
    color: ${({ theme }) => theme.colors.secondary};
  }

`

