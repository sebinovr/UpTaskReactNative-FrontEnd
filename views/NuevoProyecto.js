import React, {useState} from 'react'
import { View , Text, ToastAndroid } from 'react-native'
import { NativeBaseProvider, FormControl, Button, List, Input } from 'native-base'
import globalStyles from '../styles/global'
import { useNavigation } from '@react-navigation/native'
import { gql, useMutation, useQuery } from '@apollo/client'

const NUEVO_PROYECTO = gql`
    mutation nuevoProyecto($input: ProyectoInput){
        nuevoProyecto(input: $input){
            nombre
            id
        }
    }
`
//ACTUALIZAR CACHE
const OBTENER_PROYECTOS = gql`
    query obtenerProyectos {
        obtenerProyectos {
            id
            nombre
        }
    }
`;

const NuevoProyecto = () => {
  //State
  const [ nombre, guardarNombre ] = useState('')

  const [ mensaje, guardarMensaje ] = useState('')

  //Navigation
  const navigation = useNavigation()

  //Apollo
  const [ nuevoProyecto ] = useMutation(NUEVO_PROYECTO, {
    //Actualizar Cache - se actualiza con respuesta de data en nuevoProyecto
    update(cache, { data: { nuevoProyecto }}) {
        //Se lee cache actual con OBTENER PROYECTOS
        const { obtenerProyectos } = cache.readQuery({ query: OBTENER_PROYECTOS }); 
        //Reescribe Query de OBTENER PROYECTOS con el mutation nuevoProyecto
        cache.writeQuery({ 
            query: OBTENER_PROYECTOS,
            data: { obtenerProyectos: obtenerProyectos.concat([nuevoProyecto]) }    
        })
    }
  })

  const handleSubmit = async () => {
    if(nombre ===''){
        guardarMensaje('El nombre del proyecto es requerido.')
    }

    try {
        const { data } = await nuevoProyecto({
            variables: {
                input:{
                    nombre
                }
            }
        })

        // console.log(data)
        guardarMensaje('Proyecto Creado Correctamente.')
        navigation.navigate('Proyectos')
        
    } catch (error) {
        console.log(error.message)
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
  }

  return (
    <NativeBaseProvider>
        <View style={[globalStyles.contenedor, { backgroundColor: '#e84347'} ]}>
            <View style={ globalStyles.contenido }>
                <Text style={globalStyles.subtitulo}>Nuevo proyecto</Text>    

                <FormControl >
                    <View style={globalStyles.input}>
                        <Input 
                            placeholder='Nombre de Proyecto'
                            placeholderTextColor='#999'
                            w='100%'
                            value={nombre}
                            onChangeText={ (text) => { guardarNombre(text) } }
                        />
                    </View>

                    <Button 
                        style={globalStyles.boton}
                        onPress={() => handleSubmit()}
                    >
                        <Text style={globalStyles.botonTexto}>Crear Proyecto</Text>
                    </Button>
                </FormControl>
            </View>

            { mensaje ? mostrarAlerta() : "" }

        </View>
    </NativeBaseProvider>
  )

}

export default NuevoProyecto