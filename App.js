import React, {Component} from 'react';
import { FlatList,TouchableOpacity,StyleSheet,Keyboard } from 'react-native';
import { Container, Text, Input, Row, Col, Content, Button, Item, ListItem, Header, Title } from 'native-base';
import axios from 'axios';

export default class App extends Component {

  constructor(){
    super();
    this.state={
      set: '',
      data: []
    };
  }

  url = 'http://192.168.0.45:5000/api/todo/';

  get(){
    axios.get(this.url)
    .then(response => {
      const data = response.data;
      this.setState({data: data});
    });
  }

  componentDidMount() {
    this.get()
  }

  add = () => {
    set = this.state.set;
    axios.post(this.url, {
      text: set,
    }).then(() => {
        alert('Added')
        this.get()
        this.setState({set:''})
    }).catch(() => {
      alert('Please input your to do.');
    });
    Keyboard.dismiss();
  }

  set(text){
    this.setState({set:text});
  }

  delete = (id) => {
    axios.delete(this.url+id)
    .then(res => {
      alert('Deleted')
      this.get();
    })
  }

  render() {
    return (
      <Container>
        <Header style={styles.header}>
          <Title style={{color:'black'}}>TO DO APP</Title>
        </Header>
        <Content style={{marginTop:5}}>
          <Row style={{justifyContent:'center'}}>
            <Col style={{flex:0.98}}>
              <Item style={{borderBottomColor:'white'}}>
                <Input value={this.state.set} onSubmitEditing={this.add} onChangeText={(text)=>this.set(text)} placeholder='Type to add to do List' style={styles.input} />
                <Button onPress={this.add} style={styles.button}>
                  <Text>Add</Text>
                </Button>
              </Item>
            </Col>
          </Row>
          <FlatList
            data={this.state.data.sort((a, b) => b.id-a.id)}
            keyExtractor={(item) => item._id}
            renderItem={
              ({item}) =>
                <ListItem style={styles.listitem}>
                  <TouchableOpacity style={styles.touch} onLongPress={()=>this.delete(item._id)}>
                    <Text style={{width:100+'%'}}>{item.text}</Text>
                  </TouchableOpacity>
                </ListItem>
            }
          />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    alignItems:'center',
    backgroundColor:'white'
  },
  input: {
    backgroundColor:'#F8F8FF',
    height:'80%',
    borderRadius:10
  },
  button: {
    height:'80%',
    alignSelf:'center',
    borderRadius:10,
    marginLeft:5,
    backgroundColor:'grey'
  },
  listitem: {
    paddingBottom:0,
    paddingTop:0,
    height:50
  },
  touch: {
    flex:1,
    height:100+'%',
    justifyContent:'center'
  },
});