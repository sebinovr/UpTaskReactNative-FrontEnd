import React from 'react'
import { View , Text, StyleSheet} from 'react-native'
import { NativeBaseProvider, Container, Button, List} from 'native-base'
import globalStyles from '../styles/global'
import { useNavigation } from '@react-navigation/native'
import {gql, useQuery} from '@apollo/client'

const OBTENER_PROYECTOS = gql`
    query obtenerProyectos {
        obtenerProyectos {
            id
            nombre
        }
    }
`;

const Proyectos = () => {

  const navigation = useNavigation()

  //Apollo-QUERY
  const { data, loading, error } = useQuery(OBTENER_PROYECTOS)
  // console.log(data)
  // console.log(loading)
  // console.log(error)

  if(loading) return <Text>Cargando...</Text>

  return (
    <NativeBaseProvider>
        <View style={[globalStyles.contenedor, { backgroundColor: '#e84347'} ]}>
            <Button 
                style={[globalStyles.boton , { marginTop: 30} ]}
                onPress={() => navigation.navigate('NuevoProyecto')}
            >
                <Text style={globalStyles.botonTexto}>Nuevo Proyecto</Text> 
            </Button>

            <Text style={globalStyles.subtitulo}>Selecciona un proyecto.</Text>    

            <View>
              <List style={styles.contenido}>
                {data.obtenerProyectos.map( proyecto => (
                  <List.Item
                    key={proyecto.id}
                    onPress={()=>navigation.navigate('Proyecto', proyecto)}
                  >
                    <View>
                      <Text style={styles.texto}>{proyecto.nombre}</Text>
                    </View>

                  </List.Item>
                ))}
              </List>
            </View>

        
        </View>
    </NativeBaseProvider>
  )

}

const styles = StyleSheet.create({
  contenido: {
    backgroundColor: '#FFF',
    marginHorizontal: '3%',
  },

  texto:{
    color: 'black',
    paddingVertical: 5
  }
})

export default Proyectos