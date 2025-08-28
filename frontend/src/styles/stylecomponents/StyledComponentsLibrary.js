import styled from "styled-components"

export const Header = styled.div`
display: flex;
justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  top: 0;

`

// Container komponenter
export const Container = styled.div`
  width: 100%;
  min-height: 90vh;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  display: grid;
  
  place-items: center;
  //overflow: hidden;
  perspective: 100rem;
`



export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: ${({ maxWidth }) => maxWidth || "1200px"};
  margin: ${({ centered }) => centered ? "auto" : "0"};
`

// Button komponenter
export const PrimaryButton = styled.button`
  padding: ${({ theme }) => theme.components.button.padding};
  border: ${({ theme }) => theme.components.button.border};
  border-radius: ${({ theme }) => theme.components.button.borderRadius};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
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

export const PlantsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  padding: 1rem;
  width: 100%;
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

// Plant action komponenter
export const PlantActionButtons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
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

// Form komponenter
export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 400px;
  margin: auto;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px ${({ theme }) => theme.colors.shadow};

  img {
    width: 200px;
    height: auto;
    border-radius: 10px;
    margin-bottom: 20px;
  }
`

// Icon komponenter
export const IconButton = styled.div`
  font-size: ${({ theme }) => theme.components.icon.fontSize};
  color: ${({ theme }) => theme.colors.text};
  margin: ${({ theme }) => theme.components.icon.margin};
  cursor: ${({ theme }) => theme.components.icon.cursor};
  transition: ${({ theme }) => theme.components.icon.transition};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`


// PlantList specifika komponenter
export const PlantListContainer = styled.div`
  padding: ${({ theme }) => theme.spacing(2.5)};
  max-width: 1200px;
  margin: 0 auto;
  min-height: 60vh;

    /* If you want the plant list itself to be scrollable with fixed height: */
  
  max-height: 60vh;
  overflow-y: auto;
  
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

export const EmptyMessage = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 1.8rem;
  margin: ${({ theme }) => theme.spacing(5)} 0;
  font-family: ${({ theme }) => theme.fonts.body};
`

export const LoadingMessage = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.6rem;
  margin: ${({ theme }) => theme.spacing(5)} 0;
  font-family: ${({ theme }) => theme.fonts.body};
`

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

export const ThemedPlantsGrid = styled(PlantsGrid)`
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing(2.5)};
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

export const RemoveButton = styled(PrimaryButton)`
  background: #e74c3c;
  font-size: 1.4rem;
  margin-top: ${({ theme }) => theme.spacing(1.2)};
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(1.5)};
  
  &:hover {
    background: #c0392b;
  }

  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
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

export const CompanionInfo = styled.p`
  margin: ${({ theme }) => theme.spacing(1)} 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.3rem;
  font-family: ${({ theme }) => theme.fonts.body};

  strong {
    color: ${({ theme }) => theme.colors.primary};
  }
`

export const PlantDescription = styled.p`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 1.4rem;
  line-height: 1.5;
  margin: ${({ theme }) => theme.spacing(1)} 0;
  font-family: ${({ theme }) => theme.fonts.body};
`

export const SaveButton = styled(PrimaryButton)`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing(1.5)};
  font-size: 1.4rem;

  &.save-api {
    background: #3498db;
    
    &:hover {
      background: #2980b9;
    }
  }
`

export const NoResultsMessage = styled(EmptyMessage)`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 1.6rem;
  text-align: center;
  margin: ${({ theme }) => theme.spacing(4)} 0;
`

export const BackIcon = styled(FooterIcon)`
  position: absolute;
  top: ${({ theme }) => theme.spacing(2)};
  left: ${({ theme }) => theme.spacing(2)};
  margin: 0;
  
  svg {
    width: 28px !important;
    height: 28px !important;
  }
`