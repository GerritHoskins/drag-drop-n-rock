import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import queryString from 'query-string';
import Modal from 'react-modal';

import { ITEMS } from './items';
import {
    Button,
    ButtonText,
    UploadButton,
    Content,
    Notice,
    Container,
    Kiosk,
    Item,
    Clone,
    Row,
    TextContainer,
    StyledAudioComponent
} from './components';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

const email = 'mail.server@pixeltronics.org';

Modal.setAppElement('#root');

const Mp3 = () => (
    <StyledAudioComponent>
        <audio controls>
            <source
                src="https://uploads.codesandbox.io/uploads/user/f87b6d28-fb5f-4114-ae48-4b2237d20d9c/AMYP-music.mp3"
                type="audio/mpeg"
            />
        </audio>
    </StyledAudioComponent>
);

const idGen = (seed = 0) => {
    let id = seed;
    return () => `${++id}`;
};

const listsIdGen = idGen();
const itemsIdGen = idGen(100);

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const copy = (
    source,
    destination,
    droppableSource,
    droppableDestination,
    value
) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const item = sourceClone[droppableSource.index];

    destClone.splice(droppableDestination.index, 0, {
        ...item,
        orgId: item.id,
        id: itemsIdGen(),
        value
    });
    return destClone;
};
const remove = (source, droppableSource) => {
    const sourceClone = Array.from(source);
    sourceClone.splice(droppableSource.index, 1);
    return sourceClone;
};
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    if (droppableDestination) {
        destClone.splice(droppableDestination.index, 0, removed);
    }

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const cmdDelim = ';';
const rowDelim = ',';
const serializeMovez = lists => {
    const serialized = Object.values(lists)
        .reduce(
            (acc, items) =>
                acc.concat(
                    `${items
                        .map(item => `${item.orgId}${item.value || ''}`)
                        .join(cmdDelim)}`
                ),
            []
        )
        .join(rowDelim);
    return encodeURIComponent(serialized);
};

const itemFactory = token => {
    const item = ITEMS.find(item => token.startsWith(item.id));
    if (!item) return false;
    let value;
    if (item.type === 'valueContainer' && token.length > item.id.length) {
        value = token.substring(item.id.length);
    }

    return (
        item && {
            ...item,
            orgId: item.id,
            id: itemsIdGen(),
            value
        }
    );
};

const deserializeMovez = (serialized = '') =>
    decodeURIComponent(serialized)
        .split(rowDelim)
        .reduce((acc, list) => {
            acc[listsIdGen()] = list
                .split(cmdDelim)
                .reduce(
                    (items, encodedItem) =>
                        encodedItem
                            ? items.concat(itemFactory(encodedItem) || [])
                            : items,
                    []
                );
            return acc;
        }, {});

const editMode = 'edit';
const viewMode = 'view';

class App extends Component {
    constructor(props) {
        super(props);
        const parsed = queryString.parse(window.location.search);
        const lists = deserializeMovez(parsed.movez);
        this.state = {
            movez:
                Object.keys(lists).length > 0
                    ? lists
                    : {
                          [listsIdGen()]: []
                      },
            mode: parsed.mode || editMode,
            modal: {
                open: false,
                value: ''
            },
            groupName: parsed.groupName
        };
        document.title = 'Dance Movez';
    }

    componentDidUpdate() {
        const movez = serializeMovez(this.state.movez);
        window.history.replaceState(
            null,
            'Dance Movez',
            `${window.location.href.split('?')[0]}?movez=${movez}&mode=${
                this.state.mode
            }${
                this.state.groupName ? '&groupName=' + this.state.groupName : ''
            }`
        );
    }

    onDragEnd = result => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            if (source.droppableId !== 'ITEMS') {
                this.setState({
                    movez: {
                        ...this.state.movez,
                        [source.droppableId]: remove(
                            this.state.movez[source.droppableId],
                            source
                        )
                    }
                });
            }
            return;
        }

        switch (source.droppableId) {
            case destination.droppableId:
                this.setState({
                    movez: {
                        ...this.state.movez,
                        [destination.droppableId]: reorder(
                            this.state.movez[source.droppableId],
                            source.index,
                            destination.index
                        )
                    }
                });
                break;
            case 'ITEMS':
                const copyItem = value =>
                    this.setState({
                        movez: {
                            ...this.state.movez,
                            [destination.droppableId]: copy(
                                ITEMS,
                                this.state.movez[destination.droppableId],
                                source,
                                destination,
                                value
                            )
                        }
                    });
                if (ITEMS[source.index].type === 'valueContainer') {
                    this.openModal(copyItem, 'Enter a value', 'number', i =>
                        i.replace(/\D/g, '').substring(0, 5)
                    );
                } else {
                    copyItem();
                }
                break;
            default:
                this.setState({
                    movez: {
                        ...this.state.movez,
                        ...move(
                            this.state.movez[source.droppableId],
                            this.state.movez[destination.droppableId],
                            source,
                            destination
                        )
                    }
                });
                break;
        }
    };

    addList = e => {
        e.preventDefault();
        this.setState({ movez: { ...this.state.movez, [listsIdGen()]: [] } });
    };

    clear = e => {
        e.preventDefault();
        const entries = Object.entries(this.state.movez);
        if (
            entries.length > 0 &&
            entries[0][1].length > 0 &&
            window.confirm('Delete?')
        ) {
            this.setState({ movez: { [listsIdGen()]: [] } });
        }
    };

    toggleEdit = e => {
        e.preventDefault();
        this.setState({
            mode: this.state.mode === editMode ? viewMode : editMode
        });
    };

    afterOpenModal = () => {
        this.setState({ modal: { ...this.state.modal, value: '' } });
    };

    openModal = (cb, query, type, constraints = i => i) => {
        this.afterCloseModal = cb;
        this.constraintsFunc = constraints;
        this.setState({
            modal: { ...this.state.modal, open: true, type, query }
        });
    };

    handleModalChange = e => {
        this.setState({
            modal: {
                ...this.state.modal,
                value: this.constraintsFunc(e.target.value)
            }
        });
    };

    closeModal = () => {
        this.setState({
            modal: { ...this.state.modal, open: false }
        });
        if (this.afterCloseModal && this.state.modal.value) {
            this.afterCloseModal(this.state.modal.value);
            this.afterCloseModal = undefined;
        }
    };

    setGroupName = () => {
        const cb = value => this.setState({ groupName: value });
        this.openModal(cb, 'Artist Name', 'text', i =>
            i.replace(/[^a-zåäö0-9 -!.]/gi, '').substring(0, 30)
        );
    };

    getHref = () => {
        const groupName = encodeURIComponent(this.state.groupName || ' ');
        return `mailto:${email}?subject=DanceMovez%20${groupName}&body=Grupp: "${groupName}"%0A%0D${encodeURIComponent(
            window.location.href.replace('&mode=edit', '&mode=view')
        )}`;
    };

    render() {
        return (
            <React.Fragment>
                <Row style={{background: 'unset'}}>
                    <TextContainer
                        onClick={this.setGroupName}>
                        {this.state.groupName ? (
                            this.state.groupName
                        ) : (
                            <Notice> Artist Name</Notice>
                        )}
                    </TextContainer>
                    <Mp3 />
                    <Button onClick={this.toggleEdit}>
                        <ButtonText>
                            {this.state.mode !== editMode
                                ? 'Edit'
                                : 'Demo Mode'}
                        </ButtonText>
                    </Button>
                </Row>
                {this.state.mode === editMode && (
                    <DragDropContext onDragEnd={this.onDragEnd}>
                        <Droppable droppableId="ITEMS" isDropDisabled={true}>
                            {(provided, snapshot) => (
                                <Kiosk
                                    innerRef={provided.innerRef}
                                    isDraggingOver={snapshot.isDraggingOver}>                                    
                                    {ITEMS.map((item, index) => (
                                        index !== 0 ? (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}>
                                            {(provided, snapshot) => (
                                                <React.Fragment>
                                                    <Item
                                                        item={item}
                                                        innerRef={
                                                            provided.innerRef
                                                        }
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        isDragging={
                                                            snapshot.isDragging
                                                        }
                                                        style={
                                                            provided
                                                                .draggableProps
                                                                .style
                                                        }
                                                    />
                                                    {snapshot.isDragging && (
                                                        <Clone item={item} />
                                                    )}
                                                </React.Fragment>
                                            )}
                                        </Draggable>
                                        ):(
                                        <Item key={item.id} item={item}  />
                                        )
                                    ))}
                                </Kiosk>
                            )}
                        </Droppable>
                        <Content>
                            <Modal
                                isOpen={this.state.modal.open}
                                onAfterOpen={this.afterOpenModal}
                                onRequestClose={this.closeModal}
                                style={customStyles}
                                contentLabel={this.state.modal.query}>
                                <TextContainer>
                                    <Row>
                                        <h2>{this.state.modal.query}</h2>
                                    </Row>
                                    <form>
                                        <Row>
                                            <input
                                                style={{
                                                    fontSize: '16px'
                                                }}
                                                type={this.state.modal.type}
                                                autoFocus
                                                value={this.state.modal.value}
                                                onChange={
                                                    this.handleModalChange
                                                }
                                            />
                                        </Row>
                                        <Row>
                                            <Button
                                                style={{ marginLeft: 'auto' }}
                                                onClick={this.closeModal}>
                                                <ButtonText>OK</ButtonText>
                                            </Button>
                                        </Row>
                                    </form>
                                </TextContainer>
                            </Modal>
                            <Row style={{background: 'unset'}}>
                                <Button onClick={this.addList}>
                                    <ButtonText>Add Row</ButtonText>
                                </Button>
                                <Button onClick={this.clear}>
                                    <ButtonText>Delete</ButtonText>
                                </Button>
                                <UploadButton href={this.getHref()}>
                                    <ButtonText>Send</ButtonText>
                                </UploadButton>
                            </Row>
                            {Object.keys(this.state.movez).map((list, i) => (
                                <Droppable
                                    key={list}
                                    droppableId={list}
                                    direction="horizontal">
                                    {(provided, snapshot) => (
                                        <Container
                                            innerRef={provided.innerRef}
                                            isDragging={
                                                provided.isDragging
                                            }
                                            isDraggingOver={
                                                snapshot.isDraggingOver
                                            }>
                                            <Row  {...provided.draggableProps}
                                                                      {...provided.dragHandleProps}
                                                                      isDragging={
                                                                          snapshot.isDragging
                                                                      }>
                                                {this.state.movez[list].length
                                                    ? this.state.movez[
                                                          list
                                                      ].map((item, index) => (
                                                          <Draggable
                                                              key={item.id}
                                                              draggableId={
                                                                  item.id
                                                              }
                                                            
                                                              index={index}>
                                                              {(
                                                                  provided,
                                                                  snapshot
                                                              ) => (
                                                                  <Item
                                                                      key={
                                                                          item.id
                                                                      }
                                                                      item={
                                                                          item
                                                                      }
                                                                      innerRef={
                                                                          provided.innerRef
                                                                      }
                                                                      {...provided.draggableProps}
                                                                      {...provided.dragHandleProps}
                                                                      isDragging={
                                                                          snapshot.isDragging
                                                                      }
                                                                      style={
                                                                          provided
                                                                              .draggableProps
                                                                              .style
                                                                      }
                                                                  />
                                                              )}
                                                          </Draggable>
                                                      ))
                                                    : !provided.placeholder && (
                                                          <Notice>
                                                              Drag and Drop instructions
                                                          </Notice>
                                                      )}
                                                {provided.placeholder}
                                            </Row>
                                        </Container>
                                    )}
                                </Droppable>
                            ))}
                        </Content>
                    </DragDropContext>
                )}
                {this.state.mode !== editMode &&
                    Object.entries(this.state.movez).map(
                        ([listId, values]) =>
                            values.length > 0 && (
                                <Container key={listId}>
                                    <Row>
                                        {values.map(item => (
                                            <Item key={item.id} item={item} />
                                        ))}
                                    </Row>
                                </Container>
                            )
                    )}
            </React.Fragment>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
