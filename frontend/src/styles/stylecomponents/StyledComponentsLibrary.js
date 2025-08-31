import styled from "styled-components"









// PlantList specifika komponenter


export const ErrorMessage = styled.div`
  color: #e74c3c;
  text-align: center;
  padding: ${({ theme }) => theme.spacing(2.5)};
  background: #fdf2f2;
  border-radius: 8px;
  margin: ${({ theme }) => theme.spacing(2.5)} 0;
  font-size: 1.6rem;
  font-family: ${({ theme }) => theme.fonts.body};

`


// Card komponenter
export const PlantCard = styled.div`
height: 550px;
width: 300px;
  background: white;
  border-radius: 10px;
  padding: ${({ theme }) => theme.spacing(2)};
  box-shadow: 0 2px 8px ${({ theme }) => theme.colors.shadow};
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.colors.shadow};
  }

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


export const ThemedPlantCard = styled(PlantCard)`
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

export const PlantImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
  border-radius: 0;
  margin-bottom: 0;
`

export const PlantContent = styled.div`
  padding: ${({ theme }) => theme.spacing(2.5)};
`

export const PlantHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: ${({ theme }) => theme.spacing(1.2)};
`

export const PlantName = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing(0.6)} 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 2rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.heading};
`

export const ScientificName = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 1.4rem;
  font-style: italic;
  font-weight: 400;
  font-family: ${({ theme }) => theme.fonts.body};
`

export const PlantFacts = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  
  p {
    margin: ${({ theme }) => theme.spacing(1)} 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.4rem;
    line-height: 1.5;
    font-family: ${({ theme }) => theme.fonts.body};

    strong {
      color: ${({ theme }) => theme.colors.primary};
      font-weight: 600;
    }
  }
`

export const PlantNotes = styled.div`
  p {
    margin: 0;
    padding: ${({ theme }) => theme.spacing(1.2)};
    background: ${({ theme }) => theme.colors.backgroundAlt};
    border-radius: 6px;
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.4rem;
    font-style: italic;
    border-left: 3px solid ${({ theme }) => theme.colors.primary};
    font-family: ${({ theme }) => theme.fonts.body};
  }
`

// Search Page komponenter
export const SearchSection = styled.div`
  width: 100%;
  max-width: 600px;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

export const SearchInfo = styled.div`
  text-align: center;
  margin: ${({ theme }) => theme.spacing(2)} 0;
  
  p {
    margin: ${({ theme }) => theme.spacing(0.5)} 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.4rem;
    font-family: ${({ theme }) => theme.fonts.body};
  }

  .api-info {
    color: ${({ theme }) => theme.colors.secondary};
    font-size: 1.2rem;
  }
`

export const PlantSearchCard = styled(ThemedPlantCard)`
  position: relative;
  
  &.from-api {
    border-left: 4px solid #3498db;
  }

  &.from-db {
    border-left: 4px solid ${({ theme }) => theme.colors.primary};
  }
`

export const PlantSearchHeader = styled(PlantHeader)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(1)};
`

export const ApiBadge = styled.span`
  background: #3498db;
  color: white;
  font-size: 1rem;
  padding: ${({ theme }) => theme.spacing(0.5)} ${({ theme }) => theme.spacing(1)};
  border-radius: 12px;
  font-weight: 500;
`

export const PlantDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(0.8)};
  margin: ${({ theme }) => theme.spacing(1.5)} 0;
`

export const DetailTag = styled.span`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing(0.5)} ${({ theme }) => theme.spacing(1)};
  border-radius: 15px;
  font-size: 1.2rem;
  border: 1px solid ${({ theme }) => theme.colors.border};

  &.edible {
    background: #e8f5e8;
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

export const StyledP = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 15px;
  margin: ${({ theme }) => theme.spacing(5)} 0;
  
  strong {
    color: ${({ theme }) => theme.colors.primary};
  }
`

