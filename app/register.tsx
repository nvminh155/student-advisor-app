"use client";

import { useState } from "react";

import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { FormControl, FormControlLabel } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/auth-context";

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, isLoading } = useAuth();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      // Handle password mismatch (show toast, etc.)
      return;
    }

    try {
      await signUp(email, password, name);
      router.push("/(main)");
    } catch (error) {
      console.error("Registration failed", error);
      // Handle error (show toast, etc.)
    }
  };

  return (
    <Box className="flex-1 bg-gray-100 p-5 justify-center">
      <VStack className="space-y-4 items-center mb-10">
        <Heading className="text-xl text-primary-500">Create Account</Heading>
        <Text className="text-gray-500">Sign up to get started</Text>
      </VStack>

      <VStack className="space-y-4 mb-6">
        <FormControl>
          <FormControlLabel>Full Name</FormControlLabel>
          <Input>
            <InputField
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
            />
          </Input>
        </FormControl>

        <FormControl>
          <FormControlLabel>Email</FormControlLabel>
          <Input>
            <InputField
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Input>
        </FormControl>

        <FormControl>
          <FormControlLabel>Password</FormControlLabel>
          <Input>
            <InputField
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              type={showPassword ? "text" : "password"}
            />
          </Input>
        </FormControl>

        <FormControl>
          <FormControlLabel>Confirm Password</FormControlLabel>
          <Input>
            <InputField
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              type={showPassword ? "text" : "password"}
            />
          </Input>
        </FormControl>

        <Button
          onPress={handleRegister}
          disabled={isLoading}
          className="bg-primary-500"
        >
          <ButtonText>Sign Up</ButtonText>
        </Button>
      </VStack>

      <VStack>
        <HStack className="space-x-2">
          <Text className="text-gray-500">Already have an account?</Text>
          <Pressable
            onPress={() => {
              router.push("/login");
            }}
          >
            <Text className="text-primary-500 font-bold">Sign In</Text>
          </Pressable>
        </HStack>
      </VStack>
    </Box>
  );
}
