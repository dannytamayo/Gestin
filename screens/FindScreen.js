import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { doc, setDoc, getDoc } from "firebase/firestore/lite";
import { auth, db } from "../firebase";
import ActivityContainer from "../components/ActivityContainer";
import { useAsync } from "../hooks/useAsync";
import { useIsFocused } from "@react-navigation/native";

const FindScreen = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [datePicker, setDatePicker] = useState("Fechas");
  const [listUser, setListUser] = useState([]);
  const isFocused = useIsFocused();


  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formatDate = (date) => {
      let formatted_date =
        date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
      return formatted_date;
    };
    setDatePicker(formatDate(date));
    hideDatePicker();
  };

  const userActivitys = async () => {
    const docRef = doc(db, "listadoActividades", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    if (data === undefined) {
      setListUser([]);
    } else {
      setListUser(data["activities"]);
    }
  };

  useEffect(() => {
    if (isFocused) {
      userActivitys();
    }else{
      return;
    }
  }, [isFocused]);

  return (
    <View
      style={{
        alignItems: "center",
        flex: 1,
        backgroundColor: "#F8F3FF",
      }}
    >
      {/* Contenedor */}
      <View
        style={{
          backgroundColor: "#4632A1",
          marginTop: 30,
          borderRadius: 20,
          flex: 0.8,
          padding: 20,
          ...styles.inputContainer,
          width: "90%",
        }}
        viewVerticalOffset={-100}
      >
        {/* FECHA */}
        <TouchableOpacity
          onPress={showDatePicker}
          style={{
            flex: 0.05,
            width: "100%",
            ...styles.input,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          {datePicker === "Fecha" ? (
            <Text
              style={{
                fontWeight: "bold",
                ...styles.buttonText,
              }}
            >
              {datePicker}
            </Text>
          ) : (
            <Text
              style={{
                fontWeight: "bold",
                ...styles.buttonText,
                color: "black",
              }}
            >
              {datePicker}
            </Text>
          )}
          <Image
            source={require("../assets/icons/find.png")}
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          onTouchOutside={hideDatePicker}
        />

        {/* Actividades */}
        <ScrollView
          style={{
            paddingHorizontal: 15,
            flex: 0.9,
            width: "100%",
            backgroundColor: "#F8F3FF",
            borderRadius: 20,
            marginTop: 10,
          }}
        >
          {/* CONTENEDORES */}
          {listUser.length > 0
            ? listUser.map((item, index) => {
                return <ActivityContainer key={index} {...item} index={index}/>;
              })
            : null}
        </ScrollView>
      </View>
    </View>
  );
};

export default FindScreen;

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
  error: {
    color: "red",
    fontSize: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 20,
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 5,
    color: "white",
  },
});
