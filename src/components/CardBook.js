import {Image, View} from "react-native";
import {RectButton} from "react-native-gesture-handler";
import TextCustom from "./TextCustom";

export default function CardBook({book, onPress, uri}) {

    return (
        <RectButton onPress={onPress}
                    style={{
                        width: 140,
                        height: 200,
                        backgroundColor: "black",
                        borderRadius: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowOffset: {width: 0, height: 10},
                        shadowRadius: 15,
                        elevation: 7.5,
                    }}>
            <Image style={{flex: 1, opacity: 1, zIndex: 0, borderRadius: 10, height: 100}}
                   source={{
                       uri: uri,
                   }}
            />

        </RectButton>
    )
}
