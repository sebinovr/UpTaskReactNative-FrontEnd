import React, {useState} from 'react'
import { View, ToastAndroid } from 'react-native'
import { NativeBaseProvider, Box, FormControl, Input, Button, Text} from 'native-base'
import { useNavigation } from '@react-navigation/native'
import globalStyles from '../styles/global'
import AsyncStorage from '@react-native-async-storage/async-storage'

//Apollo
import { gql, useMutation } from '@apollo/client'

const AUTENTICAR_USUARIO = gql`
    mutation autenticarUsuario($input: AutenticarInput) {
        autenticarUsuario(input: $input) {
            token
        }
    }
`

const Login = () => {
  //States
  const [email, guardarEmail] = useState('')
  const [password, guardarPassword] = useState('')

  const [mensaje, guardarMensaje] = useState('')

  //Navigation
  const navigation = useNavigation()

  //Mutation Apollo
  const [ autenticarUsuario ]=useMutation(AUTENTICAR_USUARIO)

  const handleSubmit = async () => {
    //Validar campos llenos
    if([email, password].includes('')){
        guardarMensaje('Todos los campos son obligatorios.')
    }

    try {
      const { data } = await autenticarUsuario({
        variables:{
            input:{
                email,
                password
            }
        }
      })

      const {token} = data.autenticarUsuario
    //   console.log(token)

      //Guardar en AsyncStorage
      await AsyncStorage.setItem('token', token)

      navigation.navigate('Proyectos')
        
    } catch (error) {
        guardarMensaje(error.message)
    }

  }

  //Toast
  const mostrarAlerta = () => {
    ToastAndroid.showWithGravityAndOffset(
      mensaje,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      30,
      50,
    )

    guardarMensaje('')
  }

  return (
    <NativeBaseProvider>
        <View w="100%" style={[globalStyles.contenedor, { backgroundColor: '#e84347'} ]}>
            <View style={globalStyles.contenido}>
                <Text style={globalStyles.titulo}>UpTask</Text>
                
                <FormControl>
                    <View style={globalStyles.input}>
                        <Input 
                            placeholder='Email'
                            placeholderTextColor='#999'
                            w='100%'
                            value={email}
                            onChangeText={(text) => guardarEmail(text.toLowerCase())}
                        />
                    </View>

                    <View style={globalStyles.input}>
                        <Input 
                            placeholder='Password'
                            placeholderTextColor='#999'
                            w='100%'
                            secureTextEntry={true}
                            value={password}
                            onChangeText={(text) => guardarPassword(text)}
                        />
                    </View>
                </FormControl> 

                <Button 
                    style={globalStyles.boton}
                    onPress={() => handleSubmit()}
                >
                    <Text style={globalStyles.botonTexto}>Iniciar Sesión</Text>
                </Button>

                <Text 
                    style={globalStyles.enlace}
                    onPress={() => navigation.navigate('CrearCuenta') }
                >Crear Cuenta</Text>

                { mensaje ? mostrarAlerta() : "" }

            </View>
        </View>
    </NativeBaseProvider>   
  )
}

export default Login