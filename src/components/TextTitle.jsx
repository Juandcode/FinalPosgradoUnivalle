import {Text} from "react-native";

export default function TextTile({title}) {
    return (
        <Text className="text-secondary text-center mb-4 text-title font-nunito">
            {title}
        </Text>
    )
}
