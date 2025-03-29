"use client";

import React, { useState, useRef, useEffect } from "react";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import { Icon, SearchIcon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { dkmhTdmuService } from "@/service/dkmhTdmuService";
import { useAuth } from "@/contexts/auth-context";
import { Button, ButtonText } from "@/components/ui/button";
import { pythonService } from "@/service/pythonService";

type TMessage = {
  content: string;
  is_user?: boolean;
  createdAt: number;
};

export default function AIAdvisorScreen() {
  const { session } = useAuth();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<TMessage[]>([
    {
      content: "Hi, I'm AI Advisor. How can I help you today?",
      is_user: false,
      createdAt: Date.now(),
    },
  ]);
  const scrollViewRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleLoginDKMH = async () => {
    const res = await dkmhTdmuService.tkbtuanhocky(
      session?.sessionDKMH.access_token ?? ""
    );
    console.log("res", res);
  };

  useEffect(() => {
    handleLoginDKMH();
  }, []);

  const handleSend = async () => {
    if (input.trim() === "") return;

    setInput("");
    setMessages((prev) => [
      ...prev,
      {
        content: input.trim(),
        is_user: true,
        createdAt: Date.now(),
      },
    ]);

    const res = await pythonService.chat(input);
    const data = res.payload as TMessage[];

    if(!data) return;

    setMessages((prev) => [
      ...prev,
      {
        ...data[data.length - 1],
        createdAt: Date.now(),
      },
    ]);
    // setMessages((prev) => [...prev, userMessage]);
  };

  return (
    <Box className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <VStack className="flex-1">
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 p-4"
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {messages.map((message, i) => (
              <Box
                key={i + 1}
                className={`p-3 rounded-xl w-auto mb-3 ${
                  message.is_user
                    ? "self-end bg-blue-500"
                    : "self-start bg-gray-100"
                }`}
              >
                {!message.is_user && (
                  <HStack className="gap-2 mb-1 items-center">
                    <Avatar className="size-xs bg-primary-500">
                      <AvatarFallbackText>AI</AvatarFallbackText>
                    </Avatar>
                    <Text className="font-bold text-primary-500">
                      AI Advisor
                    </Text>
                  </HStack>
                )}
                <Text className={`${message.is_user && "text-white"}`}>
                  {message.content}
                </Text>
                <Text className="text-xs text-light-400 self-end mt-1">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </Box>
            ))}

            {/* <Button onPress={handleLoginDKMH} className="bg-primary-500">
              <ButtonText>Sign in DKMH</ButtonText>
            </Button> */}
          </ScrollView>

          <HStack className="p-4 gap-3 items-center border-t border-borderLight200 bg-white">
            <Input className="flex-1">
              <InputField
                placeholder="Ask me anything..."
                value={input}
                onChangeText={setInput}
                onSubmitEditing={handleSend}
                returnKeyType="send"
              />
            </Input>
            <Pressable
              onPress={handleSend}
              className="bg-primary-500 p-3 rounded-full"
            >
              <Icon as={SearchIcon} className="text-white size-md" />
            </Pressable>
          </HStack>
        </VStack>
      </KeyboardAvoidingView>
    </Box>
  );
}
