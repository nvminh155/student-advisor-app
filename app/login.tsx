"use client";

import { useState, useEffect } from "react";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { FormControl, FormControlLabel } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Divider } from "@/components/ui/divider";
import { Center } from "@/components/ui/center";
import { Image } from "@/components/ui/image";
import { Pressable } from "@/components/ui/pressable";

import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";

import { Redirect, useRouter } from "expo-router";
import { useAuth } from "@/contexts/auth-context";

import { auth } from "@/firebase";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import * as GoogleAuthProvider from "firebase/auth";

WebBrowser.maybeCompleteAuthSession();

const config = {
  androidClientId:
    "331906216455-ag0uacki4of520v2peqvuet0h8r2ifn7.apps.googleusercontent.com",
  scopes: ["profile", "email", "openid"],
};

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signInWithGoogle, isLoading, error, clearError } = useAuth();
  const toast = useToast();

  // const redirectUri = makeRedirectUri({
  //   scheme: 'my-scheme',
  //   path: 'redirect'
  // });
  // Development Build: my-scheme://redirect
  // Expo Go: exp://127.0.0.1:8081/--/redirect
  // Web dev: https://localhost:19006/redirect
  // Web prod: https://yourwebsite.com/redirect

  const [email, setEmail] = useState("minhnv155@gnail.com");
  const [password, setPassword] = useState("88888888");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (error) {
      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error" variant="solid">
            <ToastTitle>Error</ToastTitle>
            <ToastDescription>{error}</ToastDescription>
          </Toast>
        ),
      });
      clearError();
    }
  }, [error, clearError, toast]);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error" variant="solid">
            <ToastTitle>Error</ToastTitle>
            <ToastDescription>
              Please enter your email and password
            </ToastDescription>
          </Toast>
        ),
      });
      return;
    }
    try {
      await signIn(email, password);
      router.push("/(main)");
    } catch (error) {}
  };


 

  return (
    <Box className="flex-1 bg-gray-100 p-5 justify-center">
      <VStack className="space-y-4 items-center mb-10">
        <Image
          source={{ uri: "/placeholder.svg?height=100&width=100" }}
          alt="School Logo"
          className="w-24 h-24 rounded-full"
        />
        <Heading className="text-xl text-primary-500">
          School A Student Advisor
        </Heading>
        <Text className="text-gray-500">Sign in to continue</Text>
      </VStack>

      <VStack className="space-y-4 mb-6">
        <FormControl>
          <FormControlLabel>
            <Text>Email</Text>
          </FormControlLabel>
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
          <FormControlLabel>
            <Text>Password</Text>
          </FormControlLabel>
          <Input>
            <InputField
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              type={showPassword ? "text" : "password"}
            />
          </Input>
        </FormControl>

        <Pressable className="self-end mb-2">
          <Text className="text-primary-500 font-medium">Forgot Password?</Text>
        </Pressable>

        <Button
          onPress={handleLogin}
          disabled={isLoading}
          className="bg-primary-500"
        >
          <ButtonText>Sign In</ButtonText>
        </Button>

        <HStack className="space-x-4 items-center justify-center">
          <Divider className="flex-1" />
          <Text className="text-gray-500">OR</Text>
          <Divider className="flex-1" />
        </HStack>

        <Button
          variant="outline"
          onPress={() => {
            signInWithGoogle();
          }}
          disabled={isLoading}
          className="border border-primary-500"
        >
          <ButtonText>Sign in with Google</ButtonText>
        </Button>
      </VStack>

      <Center>
        <HStack className="space-x-2">
          <Text className="text-gray-500">Don't have an account?</Text>
          <Pressable
            onPress={() => {
              router.push("/register");
            }}
          >
            <Text className="text-primary-500 font-bold">Sign Up</Text>
          </Pressable>
        </HStack>
      </Center>
    </Box>
  );
}
