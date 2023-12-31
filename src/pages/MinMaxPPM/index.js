import { Alert, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton, Separator, ColoredInput, LoadingOverlay } from '../../components';
import { useContext, useState } from 'react';
import { HydroponicConfigContext } from '../../config/Context';
import {showToast} from "../../utils/toast";
import {useSafeAreaInsets} from "react-native-safe-area-context";


function MinMaxPPM({ navigation, route }) {
  const insets = useSafeAreaInsets()
  const hydroponicConfigContext = useContext(HydroponicConfigContext);
  const PPM = route.params.PPM;
  const [valuePPM, setValuePPM] = useState({
    minimum: PPM.minimum,
    maximum: PPM.maximum,
  });

  function changeMinMaxPPMHandler(key, text) {
    setValuePPM((prevValue) => ({
      ...prevValue,
      [key]: text,
    }));
  }

  function submitMinMaxPPMHandler() {
    const isPPMValid =
      valuePPM.minimum >= 0 &&
      valuePPM.maximum >= 0  &&
      valuePPM.minimum < valuePPM.maximum;

    if (!isPPMValid) {
      showToast('Nilai PPM Tidak Valid', 'danger','Harap masukkan nilai PPM antara 1 dan 100 dan minimum PPM harus lebih kecil dari maksimum PPM.', insets.top);
      return;
    }

    hydroponicConfigContext.setConfig('PPM', {
      minimum: parseInt(valuePPM.minimum),
      maximum: parseInt(valuePPM.maximum),
    });

    showToast('Berhasil', 'success','data telah berhasil dirubah', insets.top);

    navigation.goBack();
  }

  if (hydroponicConfigContext.loading) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.text}>
        Isikan nilai minimum dan maksimum PPM yang baru
      </Text>
      <Separator height={16} />
      <ColoredInput
        keyboardType="decimal-pad"
        placeholder="Minimum PPM"
        value={valuePPM.minimum.toString()}
        onChangeText={(text) => changeMinMaxPPMHandler('minimum', text)}
        label={"Minimum PPM"}
        editable={true}
        focus={true}
      />
      <ColoredInput
        label="Maksimum PPM"
        keyboardType="decimal-pad"
        placeholder="Maksimum PPM"
        value={valuePPM.maximum.toString()}
        onChangeText={(text) => changeMinMaxPPMHandler('maximum', text)}
        editable={true}
        focus={true}
      />
      <Separator height={16}></Separator>
      <PrimaryButton text="Update" onPress={submitMinMaxPPMHandler} />
    </View>
  );
}

export default MinMaxPPM;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 24,
  },
  text: {
    fontFamily: 'Poppins-SemiBold',
    color: 'gray',
  },
});
