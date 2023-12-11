import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function App() {
  function HomeScreen({ navigation }) {
    const [selectedTime, setSelectedTime] = useState('1'); // 初期値は1分
    const [remainingTime, setRemainingTime] = useState(parseInt(selectedTime) * 60);
    const [timerRunning, setTimerRunning] = useState(false);
    const timerRef = useRef(null);
    const [number1, setNumber1] = useState('');
    const [number2, setNumber2] = useState('');

    useEffect(() => {
      setRemainingTime(parseInt(selectedTime) * 60);
    }, [selectedTime]);

    // number1, number2 の変更を監視し、残り時間を更新
    useEffect(() => {
      if (!timerRunning) {
        setRemainingTime(parseInt(number1) * 60);
      }
    }, [number1, timerRunning]);

  const formatTime = (seconds) => {
    if (isNaN(seconds)) {
      return '0分0秒';
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}分${remainingSeconds}秒`;
  };

  const startTimer = () => {
    setTimerRunning(true);
    sendSlackNotification('入浴を開始しました！');

    const totalSeconds = parseFloat(number1) * 60;
    const totalSecondsInt = isNaN(totalSeconds) ? 0 : Math.max(0, Math.floor(totalSeconds));

    const minutes = Math.floor(totalSecondsInt / 60);
    const seconds = totalSecondsInt % 60;

    setRemainingTime(totalSecondsInt);

    timerRef.current = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timerRef.current);
          setTimerRunning(false);
          return 0;
        }

        const noticeTime = parseInt(number2) * 60;
        if (prevTime === noticeTime) {
          sendSlackNotification(`あと${number2}分で入浴が終了します！`);
        }

        return prevTime - 1;
      });
    }, 1000);
  };

    const stopTimer = () => {
      clearInterval(timerRef.current);
      setTimerRunning(false);
      sendSlackNotification('入浴が終了しました！');
    };

    const sendSlackNotification = (msg) => {
      const webhookUrl = 'https://hooks.slack.com/services/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
      const messageData1 = { text: msg };

      fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData1),
      })
        .then((response) => {
          if (!response.ok) {
            console.error('Failed to send Slack notification:', response.status, response.statusText);
          }
        })
        .catch((error) => {
          console.error('Error while sending Slack notification:', error);
        });
    };



    return (
      
      <View style={styles.container}>

        <Text style={styles.NyuukyoshaText}>利用者名 グヌンパ・ペペ</Text>
        <Text style={styles.RiyoubiText}>利用日 2030/12/01</Text>

        <View style={styles.line} />
        <View style={styles.tantousha}>
          <Text style={styles.tantoushaText}>{'担当者名　神 敬介'}</Text>
          <TouchableOpacity>
          <View style={styles.buttonTantousha}>
            <Text style={styles.buttonTantoushaText}>{'担当者変更'}</Text>
          </View>
          </TouchableOpacity>
        </View>


        <View style={styles.boxContainer}>
          <View style={styles.box}>
            <Text style={styles.BoxText}>{'入浴時間の設定'}</Text>
            <View style={styles.timeSettings}>
              <Image source={{ uri: 'https://hogehoge' }} style={styles.image} />
            <TextInput
              style={styles.input}
              value={number1}
              onChangeText={(text) => setNumber1(text)}
              keyboardType="numeric"
            />
            <Text style={styles.funText}>{'分'}</Text>
        </View>
        
        <Text>残り時間: {formatTime(remainingTime)}</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.BoxText}>{'入浴終了通知の設定'}</Text>
            <View style={styles.timeSettings}>
              <Image source={{ uri: 'https://hogehoge' }} style={styles.image} />
            <Text style={styles.funText}>{'終了'}</Text>
              <TextInput
                style={styles.input}
                value={number2}
                onChangeText={(text) => setNumber2(text)}
                keyboardType="numeric"
              />
            <Text style={styles.funText}>{'分前'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.timeSettings1}>
          <Image source={{ uri: 'https://hogehoge' }} style={styles.image1} />
          <Text style={styles.ondoText}>{'38℃'}</Text>

          <Image source={{ uri: 'https://hogehoge' }} style={styles.image1} />
          <Text style={styles.ondoText}>{'強'}</Text>
        </View>



        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={startTimer}
            style={[
              styles.buttonStart,
              timerRunning ? styles.disabledButton : null,
            ]}
            disabled={timerRunning}
          >
            <Text style={styles.buttonText}>{'入浴スタート'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={stopTimer} style={styles.buttonStop}>
            <Text style={styles.buttonText}>{'入浴ストップ'}</Text>
          </TouchableOpacity>
        </View>


      </View>
    );
  }

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerStyle: {
              backgroundColor: '#CAE4BA'
            },
            headerTitle: 'ぽ～たぶろ操作アプリ',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: 'white',
  },

  NyuukyoshaText: {
    fontSize: 36,
    textAlign: 'left',
    fontWeight: 'bold',
    color: '#262626',
  },

  RiyoubiText: {
    fontSize: 18,
    textAlign: 'right',
    color: '#262626',
  },

  tantousha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  tantoushaText: {
    fontSize: 24,
    textAlign: 'left',
    color: '#262626',
  },
  buttonTantousha: {
    backgroundColor: '#CAE4BA',
    padding: 20,
    borderRadius: 5,
  },

  buttonTantoushaText: {
    fontSize: 24,
    textAlign: 'left',
    color: '#262626',
  },

  line: {
    height: 5,
    backgroundColor: '#CAE4BA',
    marginVertical: 10,
  },

  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },

  buttonStart: {
    backgroundColor: '#CAE4BA',
    padding: 20,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  disabledButton: {
    backgroundColor: 'darkgray', // 押せない場合の色
  },
  buttonStop: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
    borderColor: '#262626',
    borderWidth: 1,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#262626',
    textAlign: 'center',
    fontSize: 30
  },

  boxContainer: {
    flexDirection: 'row',
  },
  box: {
    flex: 1,
    borderColor: '#262626', // 黒い外枠
    borderWidth: 2, // 外枠の太さ
    padding: 20,
    margin: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 10,
  },
  image1: {
    width: 30,
    height: 30,
    margin: 10,
  },
  input: {
    width: 120,
    height: 60,
    borderColor: '#262626',
    borderWidth: 1,
    marginTop: 45,
    fontSize: 50,
    textAlign: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2, // Android向けの影の設定
  },
  BoxText: {
    color: '#262626',
    fontWeight: 'bold',
    fontSize: 24,
    margin: 10,
  },
  funText: {
    color: '#262626',
    fontSize: 24,
    margin: 10,
    marginTop: 80,
  },
  timeSettings: {
    flexDirection: 'row',
    margin: 20,
  },
  timeSettings1: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 370,
    alignItems: 'center'

  },

  ondoText: {
    fontSize: 32,
    color: 'red',
    marginTop: 0,
    marginLeft: 10,
  }
});
