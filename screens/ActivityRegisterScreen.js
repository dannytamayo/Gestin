import React, { useEffect } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import { Formik, validateYupSchema } from "formik";
import { TextInput } from "react-native";
import { Picker } from "react-native";
import { useState, useContext } from "react";
import { auth, db } from "../firebase";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore/lite";

import { ConfigContext } from "../context/ConfigContext";
import { ListUserContext } from "../context/ListUserContext";
import { date } from "yup/lib/locale";

const ActivityRegisterScreen = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [TActivity, setTActivity] = useState("");
  const [listActivity, setListActivity] = useState("");
  const [Act, setAct] = useState("");
  const [datePicker, setDatePicker] = useState("Fecha");
  const [lists,setLists]=useState([]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };



  const SetData = async (activity) => {
    const docRef = doc(db, "listadoActividades", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    if(docSnap.exists()){
      await setDoc(doc(db,'listadoActividades',auth.currentUser.uid),{
        activities: [activity, 
                     ... data.activities]
       })
    }else{
      await setDoc(doc(db,'listadoActividades',auth.currentUser.uid),{
        activities: [activity]
       })
       
    }
  }

  const handleConfirm = (date) => {
    const formatDate = (date)=>{
      let formatted_date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
       return formatted_date;
      }
    console.log('ejecute handle')
    setDatePicker(formatDate(date));
    hideDatePicker();
  };

  const getListsUser = async () => {
    const confs = collection(db,'users');
    const confsSnap = await getDocs(confs);
    const data = confsSnap.docs.map(doc=>doc.data());
    console.log(data);
    setLists(data);
  }

  const getListsActivitys = async () => {
    const docRef = doc(db, "listadoActividades", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data())
  }

  useEffect(() => {
    getListsUser();

  }, []);

  const {data, setData} = useContext(ConfigContext);
  const {dataUser} = useContext(ListUserContext);
  const tipos= data.map(conf=>conf.actividades);
  const subTipos = tipos.map(tipo=>tipo.map(subTipo=>subTipo));


  useEffect(() => {
    console.log("seleccionado",TActivity);
  }, [TActivity]);
  
  return (
      <Formik
        initialValues={{ 
          typeOfActivity: "",
          activity: "",
          date: "",
          hours: "",
          personRequesting: "",
          state: "",
          observations: ""
        }}
        
        // validate={(values) => {
        //   const errors = {};
        //   if (values.typeOfActivity="0") {
        //     errors.typeOfActivity = "Seleccione un tipo de actividad";
        //   }
        //   if (values.activity="0") {
        //     errors.activity = "Seleccione una actividad";
        //   }
        //   if (values.date="Fecha") {
        //     errors.date = "Seleccione una fecha";
        //   }
        //   if (!values.hours) {
        //     errors.hours = "Ingrese las horas";
        //   }
        //   if (values.personRequesting="0") {
        //     errors.personRequesting = "Ingrese una persona que solicita";
        //   }
        //   if (values.state="0") {
        //     errors.state = "Seleccione un estado";
        //   }
        //   if (!values.observations) {
        //     errors.observations = "Ingrese una observación";
        //   }
        //   return errors;
        // }}
        onSubmit={(values) => {SetData(values)}}
      >
        
        {({ errors,handleChange, handleBlur, handleSubmit, values, resetForm }) => (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              backgroundColor: '#FAECE7',
              height: "100%",
            }}
          >
            <View style={styles.inputContainer} viewVerticalOffset={-100}>

             {/* Picker tipo de actividad  */}
            <TouchableOpacity
                style={styles.picker}
              >
              <Picker
                mode="dropdown"
                onValueChange={(itemValue, itemIndex) => {
                    values.typeOfActivity=itemValue;
                    setTActivity(itemIndex);
                  }}
                onBlur={handleBlur}
              >
                <Picker.Item color= "#898989" label="Seleccione un tipo de actividad" value="0"/>
                {
               data.map(act=>(
                    <Picker.Item label={act.nombre.charAt(0).toUpperCase() + act.nombre.slice(1)} key={act.nombre} value={act.nombre} />
                  ))
                }
              </Picker>
              </TouchableOpacity>
              {/* {errors.typeOfActivity && <Text style={styles.errors}>{errors.typeOfActivity}</Text>} */}

              {/* Picker actividad */}
              <TouchableOpacity
                style={styles.picker}
              >
              <Picker
                mode="dropdown"
                onValueChange={(itemValue, itemIndex) => {values.activity=itemValue}}
                onBlur={handleBlur}
              >
                <Picker.Item color= "#898989" label="Seleccione una actividad" value="0" />
                {
                  TActivity !== ""  ?
                  subTipos[TActivity-1].map((act)=>(
                  <Picker.Item label={act.charAt(0).toUpperCase() + act.slice(1)} key={act} value={act}/>
                  )) : 
                  console.log("no selecciono nada")
                }
               
              </Picker>
              </TouchableOpacity>
              {/* {errors.activity && <Text style={styles.errors}>{errors.activity}</Text>} */}


              {/* Fecha */}

                <TouchableOpacity 
                  onPress={showDatePicker}
                  onBlur={handleBlur}

                  style={
                    {height: 45,
                      width: "100%",
                      marginRight: 55,
                    ... styles.input}}
                >
                  { datePicker === "Fecha" ? (
                    <Text
                  style={{
                    fontWeight: "bold",
                    ... styles.buttonText,
                  }}
                      >{datePicker}</Text> 
                  )
                  :
                  <Text
                  style={{
                    fontWeight: "bold",
                    ... styles.buttonText,
                    color: 'black'
                  }}
                      >{datePicker}</Text> 
                  
                }
              {/* {errors.date && <Text style={styles.errors}>{errors.date}</Text>} */}

                  
                </TouchableOpacity>

                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                  onTouchOutside={hideDatePicker}
                  onChange={(date) => {values.date=date}}
                />

                    {/* Hora */}

                    <View
            >
              <TextInput
                onChangeText={handleChange("hours")}
                onBlur={handleBlur("hours")}
                value={values.hours}
                style={styles.input}
                placeholder="Horas"
              />
              {/* {errors.hours && <Text style={styles.errors}>{errors.hours}</Text>} */}


            </View>


             {/* Picker persona que solicita */}
                            <TouchableOpacity
                style={styles.picker}
              >
              <Picker
                mode="dropdown"
                onValueChange={(itemValue, itemIndex) => {values.personRequesting=itemValue}}
                onBlur={handleBlur}

              >
                <Picker.Item color= "#898989" label="Seleccione la persona que solicita" value="0" />
                {
                  lists.map(user=>(
                    <Picker.Item label={user.email} key={user.email} value={user.email} />
                  ))
                }
              </Picker>
              </TouchableOpacity>

              {/* {errors.personRequesting && <Text style={styles.errors}>{errors.personRequesting}</Text>} */}

              
             {/* Picker estado */}
             <TouchableOpacity
                style={styles.picker}
              
              >
              <Picker
                mode="dropdown"
                onValueChange={(itemValue, itemIndex) => {values.state=itemValue}}
                onBlur={handleBlur}

              >
                <Picker.Item color= "#898989" label="Seleccione un estado" value="0" />
                <Picker.Item label="No iniciada" value="no iniciada" />
                <Picker.Item label="En proceso" value="en proceso" />
                <Picker.Item label="Terminada" value="terminada" />
              </Picker>
              </TouchableOpacity>
              {/* {errors.state && <Text style={styles.errors}>{errors.state}</Text>} */}




            {/* Observaciones */}
            <View

            >
              <TextInput
                onChangeText={handleChange("observations")}
                onBlur={handleBlur("observations")}
                value={values.observations}
                style={styles.input}
                placeholder="Observaciones"
              />

            </View>


          <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={()=>{handleSubmit();values.date=datePicker}} title="Submit" style={styles.button}>
                <Text style={styles.buttonSubmit} 
                >Crear</Text>
              </TouchableOpacity>
       
          </View>
          
            </View>
          </View>
        )}
      </Formik>
  );
};

export default ActivityRegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#F8F3FF",
    width: "50%",
    padding: 10,
    borderRadius: 10,
    marginTop: 40,
    marginLeft: 15
  },
  buttonText: {
    color: "#898989",
    fontWeight: "600",
    fontSize: 15,
  },
  buttonSubmit: {
    color: "#ffff",
    fontWeight: "100",
    fontSize: 14,
    
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "#F8F3FF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10
  },
  buttonContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  picker: {
    color: "#898989",
    backgroundColor: "#F8F3FF",
    width: "100%",
    height: 45,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#4632A1",
    width: "50%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    borderColor: "#4632A1",
    borderWidth: 2,
  },
  errors: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    marginBottom: 5
  },

  
});
