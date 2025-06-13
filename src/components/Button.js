import {RectButton} from "react-native-gesture-handler";
import TextCustom from "./TextCustom";


export default function Button({text, onPress}) {
    return (
        <RectButton
            onPress={onPress}
            style={{
                backgroundColor: "black",
                borderRadius: 10,
                width: 140,
                height: 40,
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                elevation: 2,
            }}>
            <TextCustom text={text}/>
        </RectButton>
    )
}
