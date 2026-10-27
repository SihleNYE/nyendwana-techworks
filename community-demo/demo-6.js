
const welcomeAreaLabels={"en": {"welcomeAreaLabel": "choose your neighbourhood", "welcomeAreaHint": "choose one area or browse all Gqeberha. this filters your feed for this session only, without GPS or changing your private profile."}, "xh": {"welcomeAreaLabel": "khetha indawo ohlala kuyo", "welcomeAreaHint": "khetha indawo enye okanye jonga yonke iGqeberha. oku kuhluza iingxelo zale seshoni kuphela; akukho GPS yaye iprofayile yakho yabucala ayitshintshi."}};Object.keys(welcomeAreaLabels).forEach(code=>Object.assign(translations[code],welcomeAreaLabels[code]));
setLanguage('en',false);

