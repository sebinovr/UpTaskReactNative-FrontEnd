import React, {useState} from 'react'
import { View, ToastAndroid } from 'react-native'
import { NativeBaseProvider, FormControl, Input, Button, Text, useToast } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import globalStyles from '../styles/global'

//Apollo
import { gql, useMutation } from '@apollo/client'

const NUEVA_CUENTA = gql`
    mutation crearUsuario($input: UsuarioInput) {
        crearUsuario(input: $input)
    }
`

const CrearCuenta = () => {

    //States
    const [nombre, guardarNombre]=useState('')
    const [email, guardarEmail]=useState('')
    const [password, guardarPassword]=useState('')

    const [mensaje, guardarMensaje]=useState('')
    
    //Navigation
    const navigation = useNavigation()

    //Mutation Apollo
    const [crearUsuario] = useMutation(NUEVA_CUENTA)

    //HandleSubmit -> Registrar Usuario
    const handleSubmit = async () => {
        //Validar campos llenos
        if([nombre, email, password].includes('')){
            guardarMensaje('Todos los campos son obligatorios.')
        }

        //Password al menos 6 caracteres
        if(password.length < 6){
            guardarMensaje('La contraseña debe tener al menos 6 caracteres.')
        }

        //Guardar usuario
        try {
            const { data } = await crearUsuario({
                variables: {
                    input: {
                        nombre,
                        email,
                        password
                    }
                }
            })

            guardarMensaje(data.crearUsuario)
            navigation.navigate('Login')
            
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
                  <Text style={globalStyles.titulo}>Crea tu Cuenta</Text>
                  
                  <FormControl>

                      <View style={globalStyles.input}>
                          <Input 
                              placeholder='Nombre'
                              placeholderTextColor='#000'
                              w='100%'
                              value={nombre}
                              onChangeText={(text) => guardarNombre(text)}
                          />
                      </View>

                      <View style={globalStyles.input}>
                          <Input 
                              placeholder='Email'
                              placeholderTextColor='#000'
                              w='100%'
                              value={email}
                              onChangeText={(text) => guardarEmail(text)}
                          />
                      </View>
  
                      <View style={globalStyles.input}>
                          <Input 
                              placeholder='Password'
                              placeholderTextColor='#000'
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
                      <Text style={globalStyles.botonTexto}>Registrar Cuenta</Text>
                  </Button>
  
                  <Text 
                      style={globalStyles.enlace}
                      onPress={() => navigation.navigate('Login') }
                  >Iniciar Sesión</Text>

                  { mensaje ? mostrarAlerta() : "" }
              </View>
          </View>
      </NativeBaseProvider>
    )
}

export default CrearCuenta