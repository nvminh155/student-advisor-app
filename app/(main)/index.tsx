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
import { useAuth } from "@/contexts/auth-context";

export default function AIAdvisorScreen() {
  const { session } = useAuth();
  console.log('sessin', session);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hello! I am your School A Student Advisor. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const scrollViewRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === "") return;

    const userMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      const aiResponse = getAIResponse(input);
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const getAIResponse = (userInput: string) => {
    const responses = [
      "I can help you with that! What specific information do you need about your classes?",
      "Here's your upcoming schedule for this week. You have classes on Monday, Wednesday, and Friday.",
      "The deadline for course registration is next Friday. Make sure to complete it before then!",
      "For that question, I recommend speaking with your academic advisor. Would you like me to provide their contact information?",
      "The library is open from 8 AM to 10 PM on weekdays, and 10 AM to 6 PM on weekends.",
    ];

    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];

    return {
      id: (Date.now() + 1).toString(),
      text: randomResponse,
      sender: "ai",
      timestamp: new Date(),
    };
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
            {messages.map((message) => (
              <Box
                key={message.id}
                className={`p-3 rounded-xl w-auto mb-3 ${
                  message.sender === "user"
                    ? "self-end bg-blue-500"
                    : "self-start bg-gray-100"
                }`}
              >
                {message.sender === "ai" && (
                  <HStack className="gap-2 mb-1 items-center">
                    <Avatar className="size-xs bg-primary-500">
                      <AvatarFallbackText>AI</AvatarFallbackText>
                    </Avatar>
                    <Text className="font-bold text-primary-500">
                      AI Advisor
                    </Text>
                  </HStack>
                )}
                <Text
                  className={`${message.sender === "user" && "text-white"}`}
                >
                  {message.text}
                </Text>
                <Text className="text-xs text-light-400 self-end mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </Box>
            ))}
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
