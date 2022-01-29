import React from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import {
  ImageBackground,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { useState, useEffect,useContext} from "react";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAvoidingView } from "react-native";
// import { db } from "../database/config";
// import firestore from "@react-native-firebase/firestore";
import { db } from '../firebase';	

import { auth } from "../firebase";
import { Formik } from "formik";
import * as yup from "yup";
import { UserContext } from "../context/UserContext";
import { collection, getDocs, doc, setDoc } from "firebase/firestore/lite";


const RegisterScreen = ({ navigatio }) => {
  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .required()
      .email("Ingresa un email valido")
      .required("El email es requerido"),
    password: yup
      .string()
      .required()
      .min(
        6,
        ({ min }) => `La contraseña debe tener al menos ${min} caracteres`
      )
      .required("La contraseña es requerida"),
      // .matches(
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      //   "Debe contener caracteres"
      // ),
    passwordValidate: yup
      .string()
      .required()
      .min(
        6,
        ({ min }) => `La contraseña debe tener al menos ${min} caracteres`
      )
      .required("La contraseña es requerida")
      
  });
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [passwordValidate, setPasswordValidate] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();
  const {setIsAuthent}= useContext(UserContext);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthent(true);
      }
    });
    return unsubscribe;
  }, []);

  const saveNewUser = async (user) => {
    try {
      await db.collection("users").add({
        email: user.email,
        name: user.name,
      })
    }
    catch (error) {
      console.log(error);
    }
  }

  const SetData = async (user) => {
    await setDoc(doc(db,'users',auth.currentUser.uid),{
      name: user.name,
      email: user.email,
    })
  }

  const handleSignup = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log(user.email);
        auth
          .signInWithEmailAndPassword(email, password)
          .then((userCredentials) => {
            const user = userCredentials.user;
            SetData({name: name, email: user.email});
          })
          .catch((error) => alert(error.message));
      })
      .catch((error) => alert(error.message));
  };

  return (
    <Formik
      initialValues={{ email, password }}
      validateOnMount={true}
      onSubmit={(values) => console.log(values)}
      validationSchema={validationSchema}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        touched,
        errors,
        isValid,
      }) => (
        <ScrollView
          style={{ flex: 1, backgroundColor: "#fff" }}
          showsVerticalScrollIndicator={false}
        >
          <ImageBackground
            source={require("../images/450_1000.jpg")}
            style={{ height: Dimensions.get("window").height / 6.5 }}
          >
            {/* <View style={styles.brandView}>
          <Text style={styles.brandViewText}>GESTIN</Text>
        </View> */}
          </ImageBackground>
          <View style={styles.bottomView}>
            {/* Welcome View */}
            <View style={{ padding: 40 }}>
              <Text style={{ color: "#4632A1", fontSize: 34 }}>Registrate</Text>
              <Text>
                {/* Don't have an account? */}
                <Text style={{ color: "red", fontStyle: "italic" }}>
                  {" "}
                  {/* Register now */}
                </Text>
              </Text>
              {/* Form Inputs View */}

              <View style={{ marginTop: 50 }}>
                <KeyboardAvoidingView
                  enabled
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  style={styles.container}
                >
                  <View style={styles.inputContainer} viewVerticalOffset={-100}>
                    <TextInput
                      placeholder="Nombre"
                      value={name}
                      onChangeText={(text) => setName(text)}
                      style={styles.input}
                    />
                    <TextInput
                      placeholder="Correo Electronico"
                      value={email}
                      onChangeText={(text) => {
                        setEmail(text),
                          (values.email = text),
                          handleChange("email");
                      }}
                      onBlur={handleBlur("email")}
                      style={styles.input}
                    />
                    {errors.email && touched.email && (
                      <Text style={styles.errors}>{errors.email}</Text>
                    )}
                    <TextInput
                      placeholder="Contraseña"
                      onChangeText={(text) => {
                        setPassword(text),
                        (values.password = text),
                          handleChange("password"),
                          console.log(password);
                      }}
                      onBlur={handleBlur("password")}
                      style={styles.input}
                      value={password}
                      secureTextEntry
                    />
                    {errors.password && touched.password && (
                      <Text style={styles.errors}>{errors.password}</Text>
                    )}
                    <TextInput
                      placeholder="Validar Contraseña"
                      onChangeText={(text) => {
                        setPasswordValidate(text),
                          (values.passwordValidate = text),
                          handleChange("passwordValidate"),
                          console.log(password);
                      }}
                      onBlur={handleBlur("passwordValidate")}
                      style={styles.input}
                      value={passwordValidate}
                      secureTextEntry
                    />
                    { 
                    
                    passwordValidate !== password && (
                      <Text style={styles.errors}>
                        Las contraseñas no coinciden 
                      </Text>)
                    }
                  </View>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={handleSignup}
                      style={styles.button}
                    >
                      <Text style={styles.buttonText}>Registrarse</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => navigation.replace("Login")}
                      style={[styles.button, styles.buttonOutline]}
                    >
                      <Text style={styles.buttonOutlineText}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </KeyboardAvoidingView>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  brandView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  brandViewText: {
    color: "#ffffff",
    fontSize: 40,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  bottomView: {
    flex: 1.5,
    backgroundColor: "#fff",
    bottom: 50,
    borderTopStartRadius: 60,
    borderTopEndRadius: 60,
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
  errors: {
    fontSize: 14,
    color: "red",
    fontWeight: "bold",
    marginTop: 5,
  },
  input: {
    backgroundColor: "#F8F3FF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
});
