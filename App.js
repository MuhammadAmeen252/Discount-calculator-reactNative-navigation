import  React,{ useState }  from 'react';
import { StyleSheet,View,Text, TextInput, TouchableOpacity,FlatList,Button,Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-simple-toast';


const startScreen=({navigation})=>{
  const [price,setPrice]=useState('')
  const [percentage,setPercentage]=useState('')
  //const [saveBtnDisable,setSaveBtnDisable]=useState(true)
  const [list,setList]=useState([])
  let [key,setKey]=useState(0)
  const [isInpChanged,setIsInpChanged]=useState(true)
  

  const savedPrice=()=>{
    
    if(price!=='' && percentage!==''){
      if((price >0 && percentage>0 && percentage<=100)){
        return <Text style={{fontWeight:'bold',fontSize:30,color:'white'}}>Rs.{(price*(percentage/100)).toFixed(2) }</Text>
      }
      else{
      return <Text style={{fontSize:15,color:'white'}}>Price must be greater than 0
       and percentage must be between 0 and 100 and both must be numbers.</Text>
      }
    }
    else
    return false
  }
  
  const finalPrice=()=>{
    if(price!=='' && percentage!==''){
      if((price > 0 && percentage > 0 && percentage<=100)){
        return <Text style={{fontWeight:'bold',fontSize:30,color:'white'}}>Rs. 
      {(price-(Math.floor(price*(percentage/100)))).toFixed(2)}</Text>
      }
      
    }
    else
    return false
      
  }
  // const InputIsChanged=()=>{
  //   return saveBtnPressed=false
  // }
  const handleSave=()=>{
    setKey(key+2)
    const listItem=( {key:key,price:price,
    percentage:percentage,
    priceAfterDisc:(price-(Math.floor(price*(percentage/100)))).toFixed(2)})
    setList([...list,listItem])
    setIsInpChanged(false)
    Toast.show('Saved Successfully!');
  }
  const listItemRepitition=()=>{
    //  return list.includes(listItem.price && listItem.percentage,1)
  }
  const saveBtnDisabilty=()=>{
    if(savedPrice() && finalPrice() && isInpChanged){
      return false
    }
    else{
      return true
    }
  }
  const navigateToHistoryScreen=()=>{
    navigation.navigate('HISTORY',{list:list})
  }
  React.useLayoutEffect(() => {
    
    navigation.setOptions({
      headerRight:()=>{
        return  (
          
        <TouchableOpacity onPress={()=>navigateToHistoryScreen()}>
        <View style={styles.Historybutton}>
          <Text style={styles.buttonText}>history</Text>
        </View>
        </TouchableOpacity>)
      }
    });
  }, [list]);
  
  return(
    <View style={styles.container}>
      
      <View style={styles.inpContainer}>
        <Text style={styles.inpText}>Original Price</Text>
      <TextInput style={styles.textInpBox}
       keyboardType = 'numeric'
       placeholder='Enter Original Price'
       onChangeText={price => {
         setPrice(price)
         setIsInpChanged(true)
        }}
       ></TextInput>
       <Text style={styles.inpTextPerc}>Discount Percentage</Text>
       <TextInput style={styles.textInpBox}
       placeholder='Enter Dicount Percentage'
       keyboardType = 'numeric'
       onChangeText={percentage => {
         setPercentage(percentage)
         setIsInpChanged(true)
        }}
       ></TextInput>
       
        <View style={styles.ResultTextContainer}>
        <Text style={styles.displayResultText}>You saved:{"\n"} {savedPrice()}</Text>
        <Text style={styles.displayResultText}>Final Price:{"\n"} {finalPrice()}</Text>
        </View>
      </View> 
      <TouchableOpacity disabled={saveBtnDisabilty()} onPress={handleSave}>
           <View style={styles.button}>
             <Text style={styles.buttonText}>Save</Text>
           </View>
      </TouchableOpacity>

    </View>
  );
  
}

const historyScreen=({navigation,route})=>{
  const [list,setList]=useState(route.params.list)
  const deleteItem=(key)=>{
    const newList=list.filter((item)=>{
      return item.key!==key
    })
    setList([...newList])
  }
  const clearHistory=()=>{
    setList([])
  }
  const createTwoButtonAlert = () =>{
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear history",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => {clearHistory()} }
      ],
      { cancelable: false }
    );
    }
  React.useLayoutEffect(() => {
    
    navigation.setOptions({
      headerRight:()=>{
        return  (
          
        <TouchableOpacity onPress={createTwoButtonAlert}>
        <View style={styles.Historybutton}>
          <Text style={styles.buttonText}>Clear</Text>
        </View>
        </TouchableOpacity>)
      }
    });
  }, [list])
  

  return (
    <View>
      
        <FlatList
        keyExtractor={(item) => item.key.toString()}
        data={list}
        renderItem = {({item})=>(
          <View style={styles.modalTextContainer}>
            <Text style={styles.displayResultText}>Original Price: <Text style={styles.HisoryResultText}>{item.price}</Text>
            {"\n"}Discount: <Text style={styles.HisoryResultText}>{item.percentage}%</Text>{"\n"}
            Final Price:<Text style={styles.HisoryResultText}>{item.priceAfterDisc}</Text></Text>
            {/* <Button title="Delete" onPress={()=>deleteItem(item.key)}></Button> */}
            <TouchableOpacity onPress={()=>deleteItem(item.key)}>
            <View style={styles.Delbutton}>
              <Text style={styles.buttonText}>REMOVE</Text>
            </View>
            </TouchableOpacity>
          </View>
        
        )}>
      </FlatList>
      </View>
  )
}

const Stack = createStackNavigator();

function App({navigation}) {
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"Start"}>
        <Stack.Screen name="HISTORY" component={historyScreen} 
        options={{  
        headerTintColor:"white",
        headerStyle:{
          backgroundColor:'#f01d71'
        },
        headerTitleStyle: {
          fontSize:20,
          fontWeight:'bold',
          color:'white'
        },
        
      }
      }/>
        <Stack.Screen name="Start" component={startScreen}
        options={{title:'DISCOUNT CALCULATOR',
        
        headerTintColor:"blue",
        headerStyle:{
          backgroundColor:'#f01d71'
        },
        headerTitleStyle: {
          fontSize:20,
          fontWeight:'bold',
          color:'white'
        },
        
      }
      }
        />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles=StyleSheet.create({
  container:{
    margin:10,
    flex: 1,
    padding: 24,
  },
  row:{
    flexDirection:'row'
  }
  ,
  inpText:{
    color:'#f01d71',
    margin:5,fontSize:16,
    fontWeight:"bold",
    fontStyle: 'italic'
  },
  inpTextPerc:{
    color:'#f01d71',
    margin:5,fontSize:16,
    fontWeight:"bold",
    fontStyle: 'italic',
    marginTop:20
  },
  HisoryResultText:{
    fontSize:23,
    margin:2,
    color:'white',
    fontWeight:"bold",
    
  },
  Historybutton:{
    borderRadius:8,
    paddingVertical:10,
    paddingHorizontal:5,
    backgroundColor:'#2a9df4',
    margin:5,
  },
  listFlat:{
    backgroundColor:'grey'
  },
  inpContainer:{
    margin:10,
  },
  
  textInpBox:{
    borderColor:'#2a9df4',
    borderBottomWidth:3,
    width:'100%',
    marginRight:10,
    padding:5,  
    fontSize:18,
    color:'grey'
  },
  ScrollView:{
    backgroundColor:'grey'
  },
  title:{
    width:'100%',
    
    alignItems:'center'
  }
  ,titleText:{
    fontSize:30,
    fontWeight:'bold',
    color:'#f01d71'
  },
  ResultTextContainer:{
    margin:20,
    backgroundColor:'#2a9df4',
    borderRadius:10,
    borderColor:'grey',
    padding:15
  },
  
  displayResultText:{
    fontSize:20,
    margin:5,
    color:'white'
  },
  modalTextContainer:{
    margin:5,
  marginHorizontal:13,
    backgroundColor:'#2a9df4',
    borderRadius:10,
    borderColor:'grey',
    padding:10,
    
  },
  button:{
    borderRadius:8,
    paddingVertical:10,
    paddingHorizontal:5,
    backgroundColor:'#f01d71',
    margin:5,
    marginLeft:60,
    marginRight:60
  },
  buttonText:{
    color:'white',
    fontWeight:'bold',
    textTransform:'uppercase',
    fontSize:16,
    textAlign:'center'
  },
  Delbutton:{
    borderRadius:2,
    paddingVertical:10,
    paddingHorizontal:5,
    backgroundColor:'white',
    backgroundColor:'#ff0000',
    marginTop:3,
    marginLeft:80,
    marginRight:80
  },
  DelbuttonText:{
    color:'white',fontWeight:"bold"
  }
})
export default App;






