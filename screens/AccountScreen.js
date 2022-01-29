import React from 'react'
import { View, Text, TouchableOpacity} from 'react-native'

const AccountScreen = () => {
    return (
        <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Iniciar Sesion</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.replace("RegisterScreen")}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Registrate</Text>
        </TouchableOpacity>
      </View>
    )
}
export default AccountScreen

const styles = StyleSheet.create({

    buttonContainer: {
        width: "60%",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40,
      },
      button: {
        backgroundColor: "#4632A1",
        width: "100%",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        borderColor: "#4632A1",
        borderWidth: 2,
      },
      buttonOutline: {
        backgroundColor: "white",
        marginTop: 5,
      },
      buttonText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
      },
      buttonOutlineText: {
        color: "#4632A1",
        fontWeight: "700",
        fontSize: 16,
      },
})
