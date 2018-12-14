import React, {Component} from 'react';
import { FlatList,TouchableOpacity,StyleSheet,Keyboard,View } from 'react-native';
import { Container, Text, Input, Row, Col, Content, Button, Item, ListItem, Header, Title, Icon } from 'native-base';
import Alert from 'react-native-awesome-alerts';
import axios from 'axios';

export default class App extends Component {

  constructor(){
    super();
    this.state={
      action: 'add',
      id: '',
      set: '',
      data: [],
      confirm: {
        showDelete: false,
        showUpdate: false
      },
    };
  }

  // url = 'http://192.168.0.45:5000/api/todo/';
  url = 'https://ariefyusrontodoapi.herokuapp.com/api/todo/';

  get(){
    axios.get(this.url)
    .then(response => {
      const data = response.data;
      this.setState({data: data});
    });
  }

  componentDidMount() {
    this.get();
  }

  confirmUpdate = () => {
    this.setState({
      confirm: {
        showUpdate: true,
        showDelete: false
      }
    });
  }

  confirmDelete = (id) => {
    this.setState({
      id: id,
      confirm: {
        showUpdate: false,
        showDelete: true
      }
    });
  }

  add = () => {
    set = this.state.set;
    axios.post(this.url, {
      text: set,
    }).then(() => {
        this.get()
        this.setState({set:''})
    }).catch(() => {
      alert('Please input your to do.');
    });
    Keyboard.dismiss();
  }

  selectUpdate = (id) => {
    axios.get(this.url+id)
    .then(response => {
      this.setState({
        action: 'update',
        id: id,
        set: response.data.text
      });
    });
  }

  update = () => {
    axios.put(this.url+this.state.id, {
      text: this.state.set
    }).then(response => {
      this.get()
    });
    this.setState({
      action: 'add',
      id: '',
      set: '',
      confirm: {
        showUpdate: false
      }
    });
    Keyboard.dismiss();
  }

  cancel = () => {
    this.setState({
      action: 'add',
      id: '',
      set: ''
    });
    Keyboard.dismiss();
  }

  set(text){
    this.setState({set:text});
  }

  delete = () => {
    axios.delete(this.url+this.state.id)
    .then(response => {
      this.get();
    });
    this.setState({
      action: 'add',
      id: '',
      set: '',
      confirm: {
        showDelete: false
      }
    });
  }

  render() {
    const action = this.state.action;
    if(action=='add'){
      button = <Button onPress={this.add} style={styles.button}>
                <Text>add</Text>
              </Button>
    } else{      
       button = <Row style={{height:100+'%'}}>
                  <Button onPress={this.confirmUpdate} style={styles.button}>
                    <Icon name='save' type='MaterialIcons'></Icon>
                  </Button>                  
                  <Button danger onPress={this.cancel} style={[styles.button,{backgroundColor:'white'}]}>
                  <Icon name='close' style={{color:'grey'}} type='MaterialIcons'></Icon>
                  </Button>
                </Row>
    };

    return (
      <Container>
        <View style={[{height:40},styles.header]}>
          <Title style={{color:'black',marginTop:-2}}>TO DO APP</Title>
        </View>
        <Header style={styles.header}>
          <Row style={{justifyContent:'center'}}>
            <Col style={{flex:0.98}}>
              <Item style={{borderBottomColor:'white'}}>
                <Input value={this.state.set} onChangeText={(text)=>this.set(text)} placeholder='Type to add to do List' style={styles.input} />
                {button}
              </Item>
            </Col>
          </Row>
        </Header>
        <Content style={{marginTop:5}}>
          <FlatList
            data={this.state.data}
            extraData={this.state}
            keyExtractor={(item) => item._id}
            renderItem={
              ({item}) =>
                <ListItem style={styles.listitem}>
                  <TouchableOpacity style={styles.touch} onPress={()=>{this.selectUpdate(item._id)}} onLongPress={()=>this.confirmDelete(item._id)}>
                    <Text style={{width:100+'%'}}>{item.text}</Text>
                  </TouchableOpacity>
                </ListItem>
            }
          />
        </Content>
        
        {/* confirm update */}
        <Alert
          show={this.state.confirm.showUpdate}
          showProgress={false}
          title="Update"
          message="You sure?"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={true}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="No, cancel"
          confirmText="Yes, save it"
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => {
            this.setState({
              confirm: {
                showUpdate: false
              }
            })
          }}
          onConfirmPressed={
            this.update
          }
        />

        {/* confirm delete */}
        <Alert
          show={this.state.confirm.showDelete}
          showProgress={false}
          title="Delete"
          message="You sure?"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={true}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="No, cancel"
          confirmText="Yes, delete it"
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => {
            this.setState({
              id: '',
              confirm: {
                showDelete: false
              }
            })
          }}
          onConfirmPressed={
            this.delete
          }
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
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
    paddingLeft:10,
    height:50,
    marginLeft: 0
  },
  touch: {
    flex:1,
    height:100+'%',
    justifyContent:'center'
  },
});