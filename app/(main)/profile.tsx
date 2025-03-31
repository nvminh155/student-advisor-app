"use client";

import React from "react";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Divider } from "@/components/ui/divider";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import {
  ChevronRightIcon,
  CloseIcon,
  HelpCircleIcon,
  Icon,
  InfoIcon,
  LanguageIcon,
  LockIcon,
  NotificationIcon,
  PersonSolidIcon,
  SearchIcon,
  TrashIcon,
} from "@/components/ui/icon";
import { Switch } from "@/components/ui/switch";

import { Pressable } from "@/components/ui/pressable";
import {
  Toast,
  ToastTitle,
  ToastDescription,
  useToast,
} from "@/components/ui/toast";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";

export default function ProfileScreen() {
  const { user, signOut, error } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const router = useRouter();
  const toast = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      toast.show({
        placement: "top",
        render: () => {
          return (
            <Toast action="error" variant="solid">
              <ToastTitle>Error</ToastTitle>
              <ToastDescription>Failed to sign out</ToastDescription>
            </Toast>
          );
        },
      });
    }
  };

  return (
    <Box className="flex-1 bg-gray-100">
      <ScrollView>
        <VStack className="gap-4 p-4">
          <Box className="bg-primary-500 p-6 rounded-lg items-center mb-4">
            <Avatar className="size-xl mb-4 bg-white">
              {user?.photoURL ? (
                <AvatarImage source={{ uri: user.photoURL }} alt="Profile" />
              ) : (
                <AvatarFallbackText>
                  {user?.displayName || user?.email}
                </AvatarFallbackText>
              )}
            </Avatar>
            <Heading className="text-white">
              {user?.displayName || "Student"}
            </Heading>
            <Text className="text-white opacity-80">{user?.email}</Text>
          </Box>

          <Box className="bg-white p-4 rounded-lg shadow">
            <Heading className="text-sm mb-4">Account Settings</Heading>
            <VStack className="gap-4 divide-y">
              <HStack className="justify-between items-center">
                <HStack className="gap-2 items-center">
                  <Icon
                    as={NotificationIcon}
                    className="text-primary-500"
                  />
                  <Text>Push Notifications</Text>
                </HStack>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                />
              </HStack>

              <Pressable>
                <HStack className="justify-between items-center">
                  <HStack className="gap-2 items-center">
                    <Icon as={LockIcon} className="text-primary-500" />
                    <Text>Change Password</Text>
                  </HStack>
                  <Icon as={ChevronRightIcon} className="text-gray-400" />
                </HStack>
              </Pressable>

              <Pressable>
                <HStack className="justify-between items-center">
                  <HStack className="gap-2 items-center">
                    <Icon as={PersonSolidIcon} className="text-primary-500" />
                    <Text>Edit Profile</Text>
                  </HStack>
                  <Icon as={ChevronRightIcon} className="text-gray-400" />
                </HStack>
              </Pressable>
            </VStack>
          </Box>

          <Box className="bg-white p-4 rounded-lg shadow">
            <Heading className="text-sm mb-4">App Settings</Heading>
            <VStack className="gap-4 divide-y">
              <Pressable>
                <HStack className="justify-between items-center">
                  <HStack className="gap-2 items-center">
                    {/* lang icon */}
                    <Icon as={LanguageIcon} className="text-primary-500" />
                    <Text>Language</Text>
                  </HStack>
                  <HStack className="gap-2 items-center">
                    <Text className="text-gray-400">English</Text>
                    <Icon as={ChevronRightIcon} className="text-gray-400" />
                  </HStack>
                </HStack>
              </Pressable>

              <Pressable>
                <HStack className="justify-between items-center">
                  <HStack className="gap-2 items-center">
                    <Icon as={HelpCircleIcon} className="text-primary-500" />
                    <Text>Help & Support</Text>
                  </HStack>
                  <Icon as={ChevronRightIcon} className="text-gray-400" />
                </HStack>
              </Pressable>

              <Pressable>
                <HStack className="justify-between items-center">
                  <HStack className="gap-2 items-center">
                    <Icon as={InfoIcon} className="text-primary-500" />
                    <Text>About</Text>
                  </HStack>
                  <Icon as={ChevronRightIcon} className="text-gray-400" />
                </HStack>
              </Pressable>
            </VStack>
          </Box>

          <Button
            onPress={handleSignOut}
            variant="outline"
            className="text-danger-500 border-danger-500"
          >
            <ButtonIcon as={CloseIcon} className="text-danger-500" />
            <ButtonText>Sign Out</ButtonText>
          </Button>
        </VStack>
      </ScrollView>
    </Box>
  );
}
