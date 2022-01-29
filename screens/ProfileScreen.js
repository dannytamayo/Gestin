import React, { useContext, useState } from "react";
import { StyleSheet, Text, View, Modal, Image, TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import { auth, db } from "../firebase";
import { collection, getDocs} from "firebase/firestore/lite";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';	
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FindScreen from "./FindScreen";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { UserContext } from "../context/UserContext";
import close from "../assets/icons/close.png";
import { ErrorMessage, Field, Formik } from "formik";
ErrorMessage;
const ProfileScreen = ({ navigatio }) => {
  const navigation = useNavigation();
  const { setIsAuthent } = useContext(UserContext);
  const [viewModal, setViewModal] = useState(false);
  const [pass, setPass] = useState("");
  const [confPass, setConfPass] = useState("");
  const [newPassword, setNewPassword] = useState("");
  // const [pass, setPass] = useState("");
  // const [newPass, setNewPass] = useState("");
  // const [confirmPass, setConfirmPass] = useState("");
  const handleSignup = () => {
    auth
      .signOut()
      .then(() => {
        setIsAuthent(false);
      })
      .catch((error) => alert(error.message));
  };

  const onChangePasword = () => {
  
    var user = auth.currentUser;
    const credential = EmailAuthProvider.credential(
      user.email, 
      pass
      );

    reauthenticateWithCredential(user,credential).then(() => {

      console.log('entro al reauthenticate');
      updatePassword(user,newPassword).then( ()=> {
        alert("Contraseña actualizada");
      }).catch((error) => alert(error.message));

    }).catch(() => {
      alert("La contraseña actual no es valida");
    });
   
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {/* <Text>Bienvenido {auth.currentUser?.email}</Text> */}
        <TouchableOpacity
          style={[styles.button, styles.buttonOutline]}
          onPress={() => {
            setViewModal(true);
          }}
        >
          <Modal
            animationType="slide"
            onDismiss={() => console.log("se cerro")}
            onShow={() => console.log("se abrio")}
            transparent
            visible={viewModal}
          >
            {/* fondo */}
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(1,1,1,0.5)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Cuadro de dialogo */}
              <View
                style={{
                  height: "50%",
                  width: "85%",
                  backgroundColor: "white",
                  borderRadius: 10,
                }}
              >
                {/* Header */}
                <View
                  style={{
                    height: 45,
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingHorizontal: 10,
                    marginTop: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setViewModal(false);
                    }}
                  >
                    <Image
                      source={close}
                      style={{
                        tintColor: "#332f45",
                        marginRight: 10,
                      }}
                    />
                  </TouchableOpacity>
                </View>

                {/* Inputs valores */}

                <Formik
                  initialValues={{
                    pass: "",
                    newPass: "",
                    confirmPass: "",
                  }}
                  onSubmit={(values) => {
                    console.log(values);
                    setNewPassword(values.newPass);
                  }}
                >
                  {({ handleChange, handleBlur, handleSubmit, values }) => (
                    <View style={styles.container}>
                      <View style={styles.inputContainer}>

                        <TextInput
                          placeholder="Contraseña actual"
                          onChangeText={(text) => {
                            setPass(text),
                              (values.pass = text),
                              handleChange("pass"),
                              console.log(pass);
                          }}
                          onBlur={handleBlur("newPass")}
                          value={values.pass}
                          style={styles.input}
                          secureTextEntry
                        />

                        <TextInput
                          placeholder="Nueva Contraseña"
                          onChangeText={(text) => {
                            setNewPassword(text),
                              (values.newPass = text),
                              handleChange("newPass"),
                              console.log(newPassword);
                          }}
                          onBlur={handleBlur("newPass")}
                          value={values.newPass}
                          style={styles.input}
                          secureTextEntry
                        />

                        <TextInput
                            placeholder="Confirmar Contraseña"
                            onChangeText={(text) => {
                              setNewPassword(text),
                                (values.confirmPass = text),
                                handleChange("confirmPass"),
                                console.log(newPassword);
                            }}
                            onBlur={handleBlur("confirmPass")}
                            value={values.confirmPass}
                            style={styles.input}
                            secureTextEntry
                        />
                      </View>

                      {/* Botones Modal */}
                    
                      <View style={{
                                    width: "30%",
                                    marginTop: 40,
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                        }}>
                          
                        <TouchableOpacity
                          onPress={() => {setViewModal(false)}}
                          style={{... styles.button, ... styles.buttonOutline, marginTop:0, padding: 10 , marginRight: 10}}
                        >
                          <Text style={styles.buttonOutlineText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={()=>{handleSubmit; onChangePasword(); console.log('ultima contra',values.newPass)}}
                          style={{... styles.button,marginTop:0, padding: 10}}
                        >
                          <Text style={styles.buttonText}>Confirmar</Text>
                        </TouchableOpacity>
                      </View>
                      </View>
                  )}
                </Formik>
              </View>
            </View>
          </Modal>

          {/* Botones Screen */}
          <Text style={styles.buttonOutlineText}>Cambiar contraseña</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Cerrar Sesion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
    marginTop: 20,
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
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "#F8F3FF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
});
