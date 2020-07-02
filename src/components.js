import React from 'react';
import styled from 'styled-components';
import colors from './theme/colors'

const Content = styled.div`
  width: 89vw;
  position: relative;
`;

const ItemWrapper = styled.div`
  display: flex;           
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 7em;
  height: 5em;
  user-select: none;
  padding: 0;
  border: 1px ${props => (props.isDraggingOver ? `dashed ${colors.primary.light}` : `solid ${colors.primary.dark}`)};
  &:hover{
    background: ${props => (props.isDraggingOver  ? `${colors.primary.contrastText}` :  `${colors.secondary.dark}`)};
  }
  background: ${props => (props.isDraggingOver  ? `${colors.primary.light}` :  `${colors.primary.lght}`)};
  box-shadow: ${props => (props.isDraggingOver ? `0px 10px 13px -7px ${colors.secondary.light}` : `5px 5px 5px -2px ${colors.secondary.dark}`)};
 `;
const ItemImg = styled.img`
  width: 2em;
  height: 2em;  
`;
const ItemImgContainer = styled.div`
  max-width: 100%;
  height: auto;
  margin:4px 2px;
  border: 1px solid ${colors.primary.light};
`;
const ItemText = styled.span`
   overflow: hidden;
  display:block;
  width:100%;
  min-width:1px;
  text-align: center;
  font-size: 8px;
  color: ${colors.text.primary};
  font-weight: bold;
`;

const ItemTextHeader = styled.div`
overflow: hidden;
display:block;
width:100%;
min-width:1px;
text-align: center;
font-size: 14px;
color: color: ${colors.text.primary};
font-weight: bold;
`;

const Item = ({ item, ...rest }) => (
  <ItemImgContainer> 
    <ItemWrapper {...rest}>   
        {item.img && (          
            <ItemImg
                alt={item.content}
                src={item.img}
                width={item.size ? item.size : '40em'}
            />          
        )}     
        {item.content !== "Options" ? ( 
            <ItemText>{item.value ? item.value : item.content}</ItemText> )
          : (
            <ItemTextHeader>{item.content}</ItemTextHeader>
          )}
    </ItemWrapper>
    </ItemImgContainer>
);

const Clone = styled(Item)`
  + div {
    display: none!important;
  }
`;

const Row = styled.div`
   &:hover{
    background: ${props => (props.isDraggingOver  ? `${colors.primary.contrastText}` :  `${colors.secondary.dark}`)};
  }
  background: ${props => (props.isDraggingOver  ? `${colors.primary.light}` :  `${colors.primary.lght}`)};
  box-shadow: ${props => (props.isDraggingOver ? `0px 10px 13px -7px ${colors.secondary.light}` : `5px 5px 5px -2px ${colors.secondary.dark}`)};
  padding: 0;
  margin: 0;
  list-style: none;
  display: inline-flex;
  flex-flow: row nowrap;
  flex: 1;
  overflow-x: auto; 
  color:${colors.primary.contrastText};
 

`;

const List = styled.div`
  border: 1px ${props => (props.isDraggingOver ? `dashed ${colors.primary.light}` : `solid ${colors.primary.dark}`)};
  &:hover{
    background: ${props => (props.isDraggingOver  ? `${colors.primary.contrastText}` :  `${colors.secondary.light}`)};
  }
box-shadow: ${props => (props.isDraggingOver ? `0px 10px 13px -7px ${colors.secondary.light}` : `5px 5px 5px -2px ${colors.primary.dark}`)};
  
  padding: 0;
  font-family: sans-serif;
`;

const Kiosk = styled(List)`
   &:hover{
    background: ${props => (props.isDraggingOver  ? `${colors.primary.contrastText}` :  `${colors.secondary.light}`)};
  }
box-shadow: ${props => (props.isDraggingOver ? `0px 10px 13px -7px ${colors.secondary.light}` : `5px 5px 5px -2px ${colors.primary.dark}`)};
    float: right;
    max-width: 10vw;
    min-width: 8vw;
    border: 0;
    padding: 0;
`;

const Container = styled(List)` 
  display: flex;
  &:hover{
    background: ${props => (props.isDraggingOver  ? `${colors.primary.contrastText}` :  `${colors.secondary.light}`)};
  }
  margin-bottom: 4px;
  margin: 0.5rem;
`;

const TextContainer = styled.div`  
  display: flex;
  border: 1px ${props => (props.isDraggingOver ? `dashed ${colors.primary.light}` : `solid ${colors.primary.dark}`)};
  &:hover{
    background: ${props => (props.isDraggingOver  ? `${colors.primary.contrastText}` :  `${colors.secondary.light}`)};
  }
  color:${colors.primary.contrastText};
  font-family: sans-serif;
  flex-flow: column wrap;
  white-space: nowrap;
  overflow: hidden;
  justify-content: center;
  min-width: 200px;
  margin: 0.5rem;
  padding: 1.5rem; 
  border-radius: 3px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
`;

const Notice = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  padding: 0.5rem;
  margin: 0 0.5rem 0.5rem;
  line-height: 1.5;
`;

const buttonStyle = `
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  margin: 0.5rem;
  padding: 0.5rem;
  background: ${colors.primary.main};
  color:${colors.primary.contrastText};
  border: 1px solid ${colors.primary.light};
  border-radius: 3px;
  font-size: 1rem;
  cursor: pointer;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  margin: 0.5rem;
  padding: 0.5rem;
  background: ${colors.primary.main};
  color:${colors.primary.contrastText};
  border: 1px solid ${colors.primary.light};
  border-radius: 3px;
  font-size: 1rem;
  cursor: pointer;
`;

const ButtonText = styled.div`
  margin: 0 1rem;
  font-family: sans-serif;
  font-weight: bold;
  color: ${colors.primary.contrastText};
`;

const UploadButton = styled.a`
display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  margin: 0.5rem;
  padding: 0.5rem;
  background: ${colors.primary.main};
  color:${colors.primary.contrastText};
  border: 1px solid ${colors.primary.light};
  border-radius: 3px;
  font-size: 1rem;
  cursor: pointer;
  text-decoration: none;
`;

const StyledAudioComponent = styled.div`
  display: block;
    display: flex;
    align-items: center;   
    align-content: center;    
    justify-content: center;
    margin: 0.5rem;
    padding: 0.5rem;
    border-radius: 3px;
    font-size: 1rem;
    background: ${colors.primary.main};
    color:${colors.primary.contrastText};
    border: 1px solid ${colors.primary.light};
`;

export {
    Button,
    UploadButton,
    ButtonText,
    Content,
    Notice,
    Container,
    Kiosk,
    Item,
    ItemWrapper,
    Clone,
    Row,
    TextContainer,
    StyledAudioComponent
};
