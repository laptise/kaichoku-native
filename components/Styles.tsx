import React, { useRef, useState } from "react";
import { StyleSheet, View, TextInput, TextInputProps } from "react-native";
import color from "./colors";
import { Button, Text } from "react-native-elements";
import themeColor from "./colors";
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
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
});

interface LabelInputProps extends TextInputProps {
  title: string;
  validationMessage?: string;
  state?: [any, React.Dispatch<any>];
}
export function LabelInput(props: LabelInputProps) {
  const input = useRef(null);
  const [focused, setFocused] = useState(false);
  return (
    <View
      onTouchEnd={() => input.current.focus()}
      style={{ width: "100%", margin: 0, padding: 0 }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={[table.label]}>{props.title}</Text>
        {props.validationMessage && (
          <View
            style={{
              marginLeft: "auto",
              backgroundColor: "#dc3545",
              padding: 5,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: "white",
                fontSize: 12,
              }}
            >
              {props.validationMessage}
            </Text>
          </View>
        )}
      </View>
      <View
        style={[
          table.table,
          table.th,
          { borderColor: color(5), borderWidth: 1 },
          props.style,
        ]}
      >
        <TextInput
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          ref={input}
          onChangeText={props.onChangeText}
          autoCapitalize="none"
          keyboardType={props.keyboardType}
          spellCheck={false}
          secureTextEntry={props.secureTextEntry}
          textContentType={props.textContentType}
          placeholder={props.title}
        />
      </View>
    </View>
  );
}
