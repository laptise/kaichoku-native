import React, { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TextInputIOSProps,
  TextInputProps,
} from "react-native";
import color from "./colors";
import { Button, Text } from "react-native-elements";
export const table = StyleSheet.create({
  table: {
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: "white",
    width: "100%",
  },
  th: {
    padding: 10,
  },
  td: {
    padding: 10,
    marginLeft: "auto",
  },
  tr: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  label: {
    alignSelf: "flex-start",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
});

interface LabelInputProps extends TextInputProps {
  title: string;
  state: [any, React.Dispatch<any>];
}
export function LabelInput(props: LabelInputProps) {
  const input = useRef(null);
  const [focused, setFocused] = useState(false);
  return (
    <View
      onTouchEnd={() => input.current.focus()}
      style={{ width: "100%", margin: 0, padding: 0 }}
    >
      <Text style={[table.label]}>{props.title}</Text>
      <View
        style={[
          table.table,
          table.th,
          { borderColor: focused ? color(4, 0) : "#ccc", borderWidth: 1 },
        ]}
      >
        <TextInput
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          ref={input}
          onChangeText={(value) => props.state[1](value)}
          autoCapitalize="none"
          spellCheck={false}
          secureTextEntry={props.secureTextEntry}
          textContentType={props.textContentType}
          placeholder={props.title}
        />
      </View>
    </View>
  );
}
